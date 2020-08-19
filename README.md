# getting started
- `npm run dev` - starts dev server

# paths
## login
- POST `/register { email, password }` - `{ user: <userObj>, token: jwtSignedToken}`
- GET `/login { email, password }` - `{ user: <userObj>, token: jwtSignedToken}`

## category
- thread management
  - GET `/thread/list?lid=` - `{ threads: [<threadObj>] } // get threads of a specific lesson, should be called by tutor`
  - GET `/thread/show?uid=&lid=` - `{ thread: <threadObj> }`
  - GET `/thread/unread?cid=&uid=` - `{ unread: int }`
  - POST `/thread/new { lid }` - `{ thread: threadObj }`
  - DELETE `/thread/del?tid=` - `{ data: ok }`

## products
- post management
  - GET `/post/list?tid=` - `{ posts: [<postObj>] }` - `{ posts: [<postObj>] }`
  - GET `/post/show?pid=` - `{ post: <postObj> }`
  - POST `/post/new { video, message, grade, tid }` - `{ post: <postObj> }`
  - PUT `/post/edit { pid, video, message, grade }` - `{ post: <postObj> }`
  - DELETE `/post/del?pid=` - `{ data: ok }`

## images
- file management
  - GET `/file/list?lid=` - - `{ files: [<fileObj>] }`
  - POST `/file/new { file, lessonId, name, url, size, type }` - `{ file: <fileObj> }`
  - DELETE `/file/del?fid=` - `{ data: ok }`
