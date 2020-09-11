//filter when got array of all the posts
// var post is only one object in posts
module.exports.filter = function(posts,topic){
    var result = posts.filter(post=>
        post.topic.find(x=> x == topic)
    )
    return result;
}