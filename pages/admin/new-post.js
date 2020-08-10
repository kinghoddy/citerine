import React, { Component } from 'react';
import Router from 'next/router'
import Layout from '../../components/layout/backend';
import Editor from '../../components/editor/editor';
import firebase from '../../firebase';
import 'firebase/database';
import 'firebase/storage';
import play from '../../components/Audio/Audio'
export default class Npost extends Component {
    state = {
        formData: {
            title: "",
            body: "post body....",
        },
        userData: {

        },
        category: "poems",
        ref: "",
        src: "",
        inlineSrc: '',
        shouldPost: true,
        author: '',
        fileName: '',
        fileSize: '',
        progressMessage: '',
        progbarLength: 0
    }
    inputChanged = (e, type, val) => {
        let formData = { ...this.state.formData }
        if (type === 'body') {
            formData.body = val
            this.setState({ formData: formData })
        } else if (type === 'select') {


            this.setState({ category: e.target.value })
        } else if (type === 'newscat') {
            this.setState({ newscat: e.target.value })
        } else if (type === 'src') {
            this.setState({ src: e.target.value })
        } else if (type === 'author') {
            this.setState({ author: e.target.value })
        }
        else if (type === 'inlineSrc') {
            this.setState({ inlineSrc: e.target.value })
        }
        else {
            formData.title = e.target.value
            this.setState({ formData: formData })
        }
    }
    componentDidMount() {

        this.setState({ loading: true });
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                const userdata = {
                    ...this.state.userData
                };
                userdata.profilePicture = user.photoURL;
                userdata.uid = user.uid;
                userdata.username = user.displayName.toLowerCase();

                this.setState({
                    loading: false,
                    shouldLogout: false,
                    userData: userdata
                });
            }
        });

    }
    upload = (types) => {
        // File or Blob named mountains.jpg
        let uploadType = types

        this.setState({ shouldPost: false, loading: true, error: null })
        var files = document.createElement('input')
        files.type = 'file'
        if (types === 'images') {
            files.setAttribute('accept', 'image/*')
        } else {
            files.setAttribute('accept', 'video/*')
        }
        files.click()
        files.onchange = e => {
            let storageRef = firebase.storage().ref('img/')
            if (uploadType === 'videos') {
                storageRef = firebase.storage().ref('videos/')
            }
            const file = files.files[0];
            if (file.size > 40000000) {
                this.setState({ shouldPost: true, error: "File too large \n Maximum size is 40mb" })
            } else {
                const uploadTask = storageRef.child(file.name).put(file);
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
                    this.setState({
                        shouldPost: false, loading: false, fileName: file.name, fileSize: (snapshot.totalBytes / 1000000).toFixed(2) + ' mb'
                    })
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    var progressMessage = 'Upload is ' + Math.floor(progress) + '% Done.'
                    this.setState({ progressMessage: progressMessage, progbarLength: progress + '%' })
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            this.setState({ progressMessage: 'Upload is paused' })

                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            break;
                        default:
                            break;
                    }
                }, (error) => {
                    this.setState({ shouldLogout: true })

                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            this.setState({
                                error: "You don't have permission to access the object"
                            })
                            break;
                        case 'storage/canceled':
                            this.setState({ error: "Upload canceled" })
                            break;
                        case 'storage/unknown':
                            this.setState({ error: "Unknown error occurred" })
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                        default:
                            this.setState({ error: "Unknown error occurred" })
                            break;
                    }
                }, () => {
                    this.setState({ shouldPost: false, loading: true, progressMessage: null })

                    uploadTask.snapshot.ref.getDownloadURL().then(url => {
                        console.log(url);
                        let ref = "img/" + file.name
                        if (uploadType === 'video') {
                            firebase.database().ref('storage/videos').push(url);
                            ref = 'videos/' + file.name
                        } else {
                            firebase.database().ref('storage/pictures').push(url)
                        }
                        this.setState({ ref: ref, shouldPost: true, loading: false, type: types, progressMessage: null, src: url })
                    })

                });
            }


        }
    }

    sendPost = e => {

        e.preventDefault();
        this.setState({ play: null })
        var Post = {
            title: this.state.formData.title,
            icon: this.state.userData.profilePicture,
            username: this.state.userData.username,
            body: this.state.formData.body.split("\n").join("<br/>"),
            storageRef: this.state.ref,
            author: this.state.author,
            src: this.state.src,
            inlineSrc: this.state.inlineSrc ? this.state.inlineSrc : null,
            date: Date.now(),
            uid: this.state.userData.uid
        };
        if (Post.title && Post.body && Post.src) {
            let cat = this.state.category
            let postref = firebase.database().ref('/posts/' + this.state.category)

            console.log(true, this.state.category);

            postref.push(Post)
                .then(res => {
                    let formdata = {
                        title: '',
                        body: ''
                    }
                    this.setState({ src: '', ref: null, formData: formdata });
                    play("success");
                    Router.push('/admin/posts?cat' + cat)
                });
        } else {
            this.setState({
                error: "Fill in all fields"
            });
        }
    };
    iupload = types => {
        // File or Blob named mountains.jpg
        let uploadType = types

        this.setState({ shouldPost: false, loading: true, error: null })
        var files = document.createElement('input')
        files.type = 'file'

        files.setAttribute('accept', 'video/*')

        files.click()
        files.onchange = e => {
            let storageRef = firebase.storage().ref('/news/' + this.state.newscat)
            if (uploadType === 'videos') {
                storageRef = firebase.storage().ref('/')
            }
            const file = files.files[0];
            if (file.size > 40000000) {
                this.setState({ shouldPost: true, error: "File too large \n Maximum size is 40mb" })
            } else {
                const uploadTask = storageRef.child(types + "/" + file.name).put(file);
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
                    this.setState({
                        shouldPost: false, loading: false, fileName: file.name, fileSize: (snapshot.totalBytes / 1000000).toFixed(2) + ' mb'
                    })
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    var progressMessage = 'Upload is ' + Math.floor(progress) + '% Done.'
                    this.setState({ progressMessage: progressMessage, progbarLength: progress + '%' })
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            this.setState({ progressMessage: 'Upload is paused' })

                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            break;
                        default:
                            break;
                    }
                }, (error) => {
                    this.setState({ shouldLogout: true })

                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            this.setState({
                                error: "You don't have permission to access the object"
                            })
                            break;
                        case 'storage/canceled':
                            this.setState({ error: "Upload canceled" })
                            break;
                        case 'storage/unknown':
                            this.setState({ error: "Unknown error occurred" })
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                        default:
                            this.setState({ error: "Unknown error occurred" })
                            break;
                    }
                }, () => {
                    this.setState({ shouldPost: false, loading: true, progressMessage: null })

                    uploadTask.snapshot.ref.getDownloadURL().then(url => {
                        console.log(url);
                        const ref = '/video/' + file.name

                        this.setState({ shouldPost: true, loading: false, inlineSrc: url })
                    })



                });
            }



        }
    }
    render() {
        return <Layout route="New post">
            <Editor
                title={this.state.formData.title}
                shouldPost={this.state.shouldPost}
                body={this.state.formData.body}
                category={this.state.category}
                fileName={this.state.fileName}
                upload={t => this.upload(t)}
                iupload={(t) => this.iupload(t)}
                fileSize={this.state.fileSize}
                progressMessage={this.state.progressMessage}
                src={this.state.src}
                author={this.state.author}
                inlineSrc={this.state.inlineSrc}
                progbarLength={this.state.progbarLength}
                submit={this.sendPost}
                changed={(e, type, val) => { this.inputChanged(e, type, val) }}
            />
        </Layout>
    }
}