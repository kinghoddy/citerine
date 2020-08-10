import React, { Component } from 'react';
import Post from './posts';
import firebase from '../firebase';
import 'firebase/database';
import Link from 'next/link'

class sideWidjet extends Component {
    constructor(props) {
        super(props)

        this.state = {
            posts: {}
        }
    }
    componentDidMount() {
        this.getPosts();
    }
    getPosts = () => {
        this.setState({ loading: true })
        firebase.database().ref('posts/').on('value', s => {
            const posts = {}
            for (let cat in s.val()) {
                posts[cat] = []
                for (let keys in s.val()[cat]) {
                    posts[cat].push({
                        ...s.val()[cat][keys],
                        category: cat,
                        pid: 'posts/' + cat + '/' + keys,
                        key: keys
                    })
                }
                posts[cat] = posts[cat].reverse()

            }
            this.setState({ posts: posts, loading: false })
            console.log(posts);

        })
    }
    render() {
        let posts = this.state.posts
        let AllPosts = () => {
            let sub = []
            for (let cat in posts) {
                let item = <div>
                    {posts[cat].map((cur, i) => (
                        i < 2 && <Post {...cur} />
                    ))
                    }
                </div>
                sub.push(item)
            }
            return sub
        }
        return (
            <div className="sticky-top ">
                {AllPosts()}
                <Link href='/blog'>
                    <a className="btn btn-sm btn-primary rounded-pill text-light px-3" >See more</a>
                </Link>
            </div>
        )
    }
}

export default sideWidjet
