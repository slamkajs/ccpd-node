// 404 Page
exports.error = function(req, res) {
	res.status(404).render('error', {
		title: 'Error'
	});
}

// Home Page
exports.index = function(req, res){
  res.render('index', {
      title: 'Home'
  })
}