const https = require('https');
const { MongoClient } = require('mongodb');
const fs = require('fs');

function readEnv(path = '.env.local'){
  try{ return fs.readFileSync(path,'utf8'); }catch(e){return ''}
}

function parseEnv(txt){
  const obj={};
  txt.split(/\r?\n/).forEach(line=>{ const m=line.match(/^\s*([^#=]+)=([\s\S]*)$/); if(m) obj[m[1].trim()]=m[2].trim(); });
  return obj;
}

async function dnsOverHttps(name,type='SRV'){
  const url = `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`;
  return new Promise((resolve,reject)=>{
    https.get(url,res=>{
      let data=''; res.on('data',c=>data+=c); res.on('end',()=>{
        try{ resolve(JSON.parse(data)); }catch(e){ reject(e); }
      });
    }).on('error',reject);
  });
}

(async ()=>{
  const env = parseEnv(readEnv());
  const uri = env.MONGODB_URI;
  if(!uri){ console.error('MONGODB_URI not found'); process.exit(1); }
  console.log('Original URI:', uri);

  if(!uri.startsWith('mongodb+srv://')){ console.log('Not an SRV URI'); process.exit(0); }

  // extract credentials and host
  const m = uri.match(/^mongodb\+srv:\/\/(?:([^:]+):([^@]+)@)?([^/\?]+)(.*)$/);
  if(!m){ console.error('Could not parse SRV URI'); process.exit(1); }
  const user = m[1];
  const pass = m[2];
  const hostDomain = m[3];
  console.log('SRV domain:', hostDomain);

  try{
    const srvName = `_mongodb._tcp.${hostDomain}`;
    const srv = await dnsOverHttps(srvName,'SRV');
    // also fetch TXT records to try to discover replicaSet name or options
    const txt = await dnsOverHttps(hostDomain,'TXT');
    console.log('DOH TXT response:', JSON.stringify(txt.Answer || txt));
    console.log('DOH SRV response:', JSON.stringify(srv.Answer || srv.Answer || srv));
    const answers = (srv.Answer||[]).filter(a=>a.type===33 || String(a.type)==='33');
    if(answers.length===0){ console.error('No SRV answers'); process.exit(2); }
    const hosts = answers.map(a=>{ // data like "0 5 27017 host1.example.net."
      const parts = a.data.split(' ');
      return { priority: parts[0], weight: parts[1], port: parts[2], host: parts.slice(3).join(' ').replace(/\.$/,'') };
    });
    console.log('Resolved hosts:', hosts);

    const hostList = hosts.map(h=>`${h.host}:${h.port}`).join(',');
    let standard = 'mongodb://';
    if(user && pass) standard += `${encodeURIComponent(user)}:${encodeURIComponent(pass)}@`;
    // try without replicaSet first
    standard += `${hostList}/Trust?ssl=true&authSource=admin&retryWrites=true&w=majority`;
    console.log('Constructed standard URI (redact password if needed):', standard);

    // try to connect
    const client = new MongoClient(standard, { serverSelectionTimeoutMS: 10000 });
    try{
      await client.connect();
      console.log('Connected using constructed URI');

      // list databases
      try{
        const admin = client.db().admin();
        const dbs = await admin.listDatabases();
        console.log('Databases visible:', dbs.databases.map(d=>d.name));
        for(const d of dbs.databases){
          try{
            const cdb = client.db(d.name);
            const collections = await cdb.listCollections().toArray();
            console.log(`DB: ${d.name} -> collections:`, collections.map(c=>c.name));
          }catch(e){ /* ignore */ }
        }
      }catch(e){ console.log('Could not list databases:', e.message); }

      // check specific likely DBs
      for(const dbName of ['Trust','trust','test']){
        try{
          const db = client.db(dbName);
          const cols = await db.listCollections().toArray();
          console.log(`Collections in ${dbName}:`, cols.map(c=>c.name));
          const sample = await db.collection('donors').findOne();
          console.log(`Sample donor in ${dbName}:`, sample);
        }catch(e){ }
      }

      await client.close();
    }catch(e){ console.error('Connect error:', e.message); }

  }catch(e){ console.error('DOH error:', e.message); process.exit(3); }

})();