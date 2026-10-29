const jwt = require('jsonwebtoken')

module.exports = function(req,res,next){
  const auth = req.headers.authorization
  if(!auth) return res.status(401).json({message:'Unauthorized'})
  const token = auth.split(' ')[1]
  try{
    const data = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    req.user = data
    next()
  }catch(e){
    res.status(401).json({message:'Unauthorized'})
  }
}
