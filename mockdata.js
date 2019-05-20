// https://www.npmjs.com/package/casual
// https://www.npmjs.com/package/faker
const casual = require('casual');
const faker = require('faker');

// Create an object for config file
const db = {
    //books:[],
    users: [],
    posts: [],
    comments: []
};

for (let i=1; i <= 5; i++) {
    // books:
    // db.books.push({
    //     id: i,
    //     title: casual.words(casual.integer(1,6)),
    //     author: casual.first_name + ' ' + casual.last_name,
    //     rating: Math.floor(Math.random()*100+1)/20,
    //     year_published: casual.integer(1700,2019)
    // });

    // users:
    db.users.push({
        id: i,
        email: casual.email,
        firstname: casual.first_name,
        lastname: casual.last_name,
        password: casual.password,
        avatar: faker.image.avatar()
    })

    // blog posts
    db.posts.push({
        id: i, 
        title: casual.title,
        body: casual.sentences(n=casual.integer(10,20)),
        user_id: casual.integer(1,10),
        date: casual.date(format = 'YYYY-MM-DD'),
        images: [
            faker.random.image(),
            faker.random.image()
        ]
    })

    // comments
    for (let j=1; j <= casual.integer(1,5); j++) {
        db.comments.push({
            id: db.comments.length + 1,
            post_id: i,
            body: casual.sentences(n=casual.integer(2,10)),
            date: casual.date(format = 'YYYY-MM-DD')
        })
    }
}
console.log(JSON.stringify(db));