const jwt = require('jsonwebtoken')
const storage = require('../storage')
const bcrypt = require('bcrypt')

exports.login = async (req, res) => {
  const { email, password } = req.body

  // Find user in JSON store
  const user = storage.findUser(email || '')
  if (!user) {
    // Fallback for first-time setup - create admin
    if (email && (email.toLowerCase() === 'admin@aurajewellers.com' || email.toLowerCase() === 'admin@mgs.com') && password === 'Password123') {
      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = storage.createUser({ username: email, password: hashedPassword, email })
      const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
      return res.json({ token })
    }
    return res.status(401).json({ message: 'Invalid credentials' })
  }


  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
  res.json({ token })
}