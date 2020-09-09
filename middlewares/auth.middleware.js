module.exports.requireAuth = function(req,res,next){
    if(!req.signedCookies.id){
        res.redirect('/login')
    }
    else{
        next()
    }
}