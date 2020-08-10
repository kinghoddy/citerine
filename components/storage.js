import React, { Component } from 'react';
import firebase from '../firebase';
import 'firebase/database';
import Spinner from './UI/Spinner/Spinner';
import Toast from './UI/Toast/Toast';

export default class Storage extends Component {
    constructor(props) {
        super(props)
        this.copyInput = React.createRef()
    }
    state = {
        storage: {
            videos: [],
            pictures: []
        },
        load: 'pictures',
        clipboard: {
            key: null,
            src: ''
        }
    }
    componentDidMount() {
        this.getStorage()
    }
    inputChanged = e => {
        let clip = { ...this.state.clipboard }
        clip.src = e.target.value
        this.setState({ clipboard: clip })
    }

    getStorage = () => {
        this.setState({ loading: true })
        firebase.database().ref('storage/').on('value', s => {
            const storage = { videos: [], pictures: [] }
            for (let type in s.val()) {
                for (let key in s.val()[type]) {
                    storage[type].push({ key: key, src: s.val()[type][key] })
                }
            }
            this.setState({ storage: storage, loading: false })
        })

    }
    setClipboard = (item) => {
        this.setState({
            clipboard: {
                ...item
            }
        })
    }
    copy = () => {
        this.setState({ toast: null })
        let input = this.copyInput.current
        input.addEventListener('focus', e => {
            e.preventDefault()
        })
        input.select()
        let copy = document.execCommand('copy')
        let msg = copy ? 'Copied url to clipboard' : 'Failed to copy to clipboard';
        setTimeout(() => {

            this.setState({ toast: msg })
        }, 500)
        this.props.copied()
    }
    playPause = e => {
        console.log(e.target);

        if (e.target.paused) {

            e.target.play()
        } else {

            e.target.pause()
        }
    }
    render() {
        return (
            <div className="d-flex flex-column bg-white con" >
                <div className="d-flex tab">
                    <button onClick={() => {
                        this.setState({ load: 'pictures' })
                    }} className={this.state.load === 'pictures' ? 'active' : null} >
                        Pictures
                    </button>
                    <button onClick={() => {
                        this.setState({ load: 'videos' })
                    }} className={this.state.load === 'videos' ? 'active' : null} >
                        Videos
                    </button>
                </div>
                <div className="row no-gutters mediaCon">
                    {this.state.loading ? <div style={{ height: '50vh', width: '100%' }}><Spinner fontSize="4px" /> </div> : null}
                    {this.state.storage[this.state.load].map(cur => (
                        <div className={"media p-1 col-6 col-md-4 col-lg-3 " + (this.state.clipboard.key === cur.key ? 'active' : null)} key={cur.key} onClick={() => { this.setClipboard(cur) }}>{
                            this.state.load === 'pictures' ? <img alt="" src={cur.src} /> : <video onClick={this.playPause} src={cur.src} > </video>
                        }
                        </div>
                    )
                    )}
                </div>
                <div className="d-flex mt-auto align-items-center pt-3">
                    <span className="px-2 text-info" style={{ flexShrink: "0" }}>{this.state.storage[this.state.load].length} items</span>
                    <input ref={this.copyInput} onChange={this.inputChanged} value={this.state.clipboard.src} className="form-control" placeholder="Media url" />
                    <button onClick={this.copy} className="btn btn-info">Copy</button>
                </div>
                {this.state.toast ? <Toast>{this.state.toast} </Toast> : null}
                <style jsx>{`
                .con {
                    min-height : 20rem;
            
                }
                .tab { 
                    height : 3rem
                }
                .tab button {
                    height : 100%;
                    width : 50%;
                    background : #ddd;
                    border : 0;
                }
                .tab button:focus{
                    outline : 0;
                }
                .tab .active {
                    color : #23a;
                    background : #cdf;
                }
                .mediaCon{
                            max-height : 60vh;
                    overflow : auto;
                }

                .media > * {height : 10rem ; width : 100%; object-fit : cover ; background : #aaa}
                .media.active > *{
                    border :4px solid rgba(50,100,190 ,1)
                }
                `} </style>
            </div>
        )
    }
}

