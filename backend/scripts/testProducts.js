const http = require('http')

const token = process.argv[2]
if(!token) return console.error('Usage: node testProducts.js <token>')

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/products',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
}

const req = http.request(options, (res)=>{
  let body = ''
  res.on('data', chunk=> body += chunk)
  res.on('end', ()=>{
    console.log('STATUS', res.statusCode)
    try{
      console.log('BODY', JSON.parse(body))
    }catch(e){
      console.log('BODY', body)
    }
  })
})
req.on('error', (e)=> console.error('ERR', e))
req.end()
