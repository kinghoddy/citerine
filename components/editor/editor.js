import React, { useState, useEffect, useRef } from 'react';
import firebase from '../../firebase';
import 'firebase/auth';
import 'firebase/database'
import Toast from '../UI/Toast/Toast';
import Spinner from '../UI/Spinner/Spinner'
import Storage from '../storage'
import CKEditor from 'ckeditor4-react';
class MyUploadAdapter {
    getToken = () => {
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((idToken) => {
            return idToken
        }).catch(function (error) {
            console.log(error);
            // Handle error
        });
    }
    constructor(loader) {
        // The file loader instance to use during the upload.
        this.loader = loader;
    }

    // Starts the upload process.
    upload() {
        return this.loader.file
            .then(file => new Promise((resolve, reject) => {
                this._initRequest(file, this.getToken());
                this._initListeners(resolve, reject, file);
                this._sendRequest(file);
            }));
    }

    // Aborts the upload process.
    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }

    // Initializes the XMLHttpRequest object using the URL passed to the constructor.
    _initRequest(file, token) {
        const xhr = this.xhr = new XMLHttpRequest();

        console.log(token);

        xhr.open('POST', 'https://firebasestorage.googleapis.com/v0/b/pova-aa286.appspot.com/o/img/' + file.name + '?auth=' + token, true);
        xhr.responseType = 'json';

    }

    // Initializes XMLHttpRequest listeners.
    _initListeners(resolve, reject, file) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = `Couldn't upload file: ${file.name}.`;

        xhr.addEventListener('error', () => reject(genericErrorText));
        xhr.addEventListener('abort', () => reject());
        xhr.addEventListener('load', () => {
            const response = xhr.response;

            // This example assumes the XHR server's "response" object will come with
            // an "error" which has its own "message" that can be passed to reject()
            // in the upload promise.
            //
            // Your integration may handle upload errors in a different way so make sure
            // it is done properly. The reject() function must be called when the upload fails.
            if (!response || response.error) {
                return reject(response && response.error ? response.error.message : genericErrorText);
            }

            // If the upload is successful, resolve the upload promise with an object containing
            // at least the "default" URL, pointing to the image on the server.
            // This URL will be used to display the image in the content. Learn more in the
            // UploadAdapter#upload documentation.
            resolve({
                default: response.url
            });
        });

        // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
        // properties which are used e.g. to display the upload progress bar in the editor
        // user interface.
        if (xhr.upload) {
            xhr.upload.addEventListener('progress', evt => {
                if (evt.lengthComputable) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        }
    }

    // Prepares the data and sends the request.
    _sendRequest(file) {
        // Prepare the form data.
        const data = new FormData();

        data.append('upload', file);

        // Important note: This is the right place to implement security mechanisms
        // like authentication and CSRF protection. For instance, you can use
        // XMLHttpRequest.setRequestHeader() to set the request headers containing
        // the CSRF token generated earlier by your application.

        // Send the request.
        this.xhr.send(data);
    }
}
export default props => {
    const editorRef = useRef()
    const [editorLoaded, setEditorLoaded] = useState(false)
    // const { CKEditor, ClassicEditor } = editorRef.current || {}

    useEffect(() => {
        editorRef.current = {
            CKEditor: require('@ckeditor/ckeditor5-react'),
            ClassicEditor: require('@ckeditor/ckeditor5-build-classic')
        }
        setEditorLoaded(true)
    }, []);
    const MyCustomUploadAdapterPlugin = (editor) => {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            // Configure the URL to the upload script in your back-end here!
            return new MyUploadAdapter(loader);
        };
    }
    const [showModal, setShowModal] = useState(false)
    const [toast, setToast] = useState(null);
    const [feature, setFeature] = useState('');
    const copied = () => {
        setToast(null)
        setShowModal(false)
        setTimeout(() => {
            setToast('Copied url to clipboard')
        }, 500);
    }

    return editorLoaded ? (
        <form onSubmit={props.submit} className="wrapper">
            {showModal ? <div className="storage" >
                <div className="backdrop" onClick={() => { setShowModal(false) }} ></div>
                <div className="container py-2">
                    <Storage copied={copied} />
                </div>
            </div> : null}
            {toast ? <Toast>{toast} </Toast> : null}

            {props.progressMessage ? <div className={'row no-gutters py-4 px-4 my-2 bg-white'}>
                <p className="col-12"><strong>File name :</strong> {props.fileName} </p>
                <p className="col-12"><strong>File size :</strong> {props.fileSize} </p>

                <div className='progBar'>
                    <span></span>
                </div>
                <h4 className="h5 pt-3 font-weight-bold">{props.progressMessage}</h4>
            </div> : null}
            <div className="d-flex  pb-2 mb-3 border-bottom  align-items-center justify-content-between">
                <div>
                    {props.category === 'videos' ? <button type="button"
                        onClick={() => props.upload("video")}
                        className='btn btn-outline-info'
                    >
                        <i className="material-icons text-warning pr-2">videocam</i>
         Add a  video
        </button> : <button
                            type="button"
                            onClick={() => props.upload("images")}
                            className='btn btn-outline-info btn-sm'
                        >
                            <i className="fa fa-image text-warning pr-2"></i>
          Add a Photo
        </button>} <br />
                    <button onClick={() => setShowModal(true)} type="button" className="btn btn-info">Open media storage</button>

                    <h5 className="m-1">Or paste a url</h5>
                    <input type="text" onChange={(e) => { props.changed(e, 'src') }}
                        value={props.src}
                        placeholder="Paste url here" />
                </div>
                {props.src ? (
                    <div className="media " >
                        {props.category === "videos" ? (
                            <video src={props.src} autoPlay muted> </video>
                        ) : <img src={props.src} alt="" />}

                    </div>
                ) : <div className="box">
                        {props.category === 'videos' ?
                            <i className="material-icons md-48 text-warning pr-2">videocam</i> :
                            <i className="material-icons md-48 text-success pr-2">photo</i>}
                    </div>}
            </div>

            <div className="pb-3 d-flex justify-content-between align-items-center">
                <h5>{props.editing ? 'Edit ' : 'New '}{props.category} post</h5>
                {props.shouldPost ? <div className="d-flex">
                    {props.editing ? <React.Fragment>
                        <button type="button" onClick={props.deletePost} className="btn mx-1 bg-danger text-light">
                            <i className="fa fa-trash-alt mr-2"></i> Delete
                    </button>
                        <button type="button" onClick={props.updatePost} className="btn mx-1 bg-white text-primary">
                            <i className="fa fa-edit mr-2"></i> Update
                    </button>
                    </React.Fragment> : null}
                    <button
                        className=" d-flex btn rounded-pill  align-items-center"
                        style={{
                            border: 0,
                            outline: 0,
                            background: "#fff"
                        }}
                    >
                        <i className="material-icons h-100 mx-auto"
                            style={{
                                fontSize: "1.5rem",
                                lineHeight: "1",
                                color: "orangered"
                            }}
                        >
                            send
          </i> Publish
                </button> </div> : 'Please wait'}
            </div>

            <input className="input" onChange={props.changed} type="text" value={props.title} placeholder="Post title" />
            <CKEditor
                type="classic"
                data={props.body}
                onInit={editor => {
                    // You can store the "editor" and use when it is needed.
                }}
                onChange={(event) => {
                    const data = event.editor.getData().replace(/(\r\n|\n|\r)/gm, "")
                    props.changed(event, 'body', data)
                }}

            />
            <div className="d-flex mt-2 py-2 mb-3 border-bottom  align-items-center justify-content-between">
                <div>
                    <button type="button"
                        onClick={() => props.iupload("video")}
                        className='btn btn-danger'
                    >
                        <i className="material-icons text-warning pr-2">videocam</i>
         Add an inline video        </button>

                    <h5 className="m-1">Or paste a url</h5>
                    <input type="url" onChange={(e) => { props.changed(e, 'inlineSrc') }}
                        value={props.inlineSrc}
                        placeholder="Paste url here" />
                </div>


                <div className="box">
                    <div className="media " >
                        <video src={props.inlineSrc} autoPlay muted> </video>
                    </div>
                </div>
            </div>
            {props.isNews ?
                <input type="text" required className="form-control" onChange={(e) => {
                    props.changed(e, 'author')
                }} value={props.author} placeholder="Sermon by...." /> : null}

            <div className='d-flex '>
                <select
                    className=" form-control my-2 col-6"
                    onChange={(event) => {
                        props.changed(event, 'select')
                    }}
                >
                    <option selected={props.category === 'poems' ? true : false} value="poems">Poems</option>
                    <option selected={props.category === 'short-stories' ? true : false} value="short-stories">Short Stories</option>
                    <option selected={props.category === 'others' ? true : false} value="others">Others</option>
                </select>
                {/* {props.isNews ? <select
                    className=" form-control my-2 col-6"
                    onChange={(event) => {
                        props.changed(event, 'newscat')
                    }}
                >
                    <option selected={props.newscat === 'sermon' ? true : false} value="sermon">sermon</option>
                    <option selected={props.newscat === 'blessings' ? true : false} value="blessings">You are blessed</option>
                    <option selected={props.newscat === 'quickSermons' ? true : false} value="quickSermons">Quick sermons</option>
                </select> : null} */}
            </div>

            <style jsx>
                {`
                .wrapper {
                    width : 90%;
                    margin : 3rem auto ; 
                }
          
                .progBar {
                    height: 0.2rem;
                    width: 100%;
                    padding: 0;
                    margin: 0;
                    background: #ddd;
                    display: flex;
                }
                
                .progBar span {
                    height: 100%;
                    padding: 0;
                    margin: 0;
                    display: inline-block;
                    background: #33f;
                    width : ${props.progbarLength}
                }

                .input {
                    width : 100%;
                    font-size : 1.3rem;
                    padding : .5rem 2rem;
                    margin-bottom : 1rem;
                    border-radius : 10px;
                    border : 1px solid #eee;
                }
                .box{
                    display : flex;
                    align-items : center;
                    justify-content : center;
                    height : 10rem;
                    width : 10rem;
                    background : #fff;
                }
                .box 1 {
                    font-size : 3rem !important;
                }
                .media {
  width: 10rem;
  height : 10rem;
  border-radius: 1rem;
  background: var(--light);
}
.media > * {
  width: 100%;
  height : 100%;
  object-fit: cover;
}

.btn:hover {
  color: VAR(--BLACK);
}
.storage {
    height : 100vh;
    position : fixed;
    left : 0;
    width : 100%;
    z-index : 3000;
    top : 0;
}
.backdrop {
      height : 100vh;
    position : absolute;
    left : 0;
    width : 100%;
    top : 0;
    z-index : -1;
    backdrop-filter : blur(.4rem) brightness(60%)
}
.storage > .container {
    max-width : 40rem;
    margin-top : 3rem 
}


                @media only screen and (min-width : 760px){
                    .box {
                    width : 25rem
                    }
                    .media {
                        width : 25rem
                    }
                     .wrapper {
                         max-width : 80%
                     }
                }
                `}
            </style>
        </form>
    ) : (
            <div>Editor loading</div>
        )
}
