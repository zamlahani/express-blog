function index(req, res) {
  res.json([
    {
      id: 1,
      name: 'Khussal Zamlahani'
    }
  ])
}

module.exports = { index }