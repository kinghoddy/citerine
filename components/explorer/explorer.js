import React, { Component } from 'react';
import classes from './exp.module.css';
import Folder from './folder';
import localData from './local.json'

class explorer extends Component {
    state = {
        showSplashScreen: true,
        structure: [
            {
                name: 'local',
                type: 'folder',
                children: []
            },
            {
                name: 'uploaded',
                type: 'folder',
                children: []
            }
        ]


    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ showSplashScreen: false })
        }, 2000)
        let structure = this.state.structure
        structure[0].children = localData
        this.setState({
            structure: structure
        })
        console.log(structure);
    }

    render() {
        let level = 2
        const fileStr = (data) => {
            level++
            return data.map(cur => (
                <div className={"pb-" + level}> <Folder style="list" {...cur} />
                    {cur.children ? cur.children.map(current => <React.Fragment>
                        <Folder className={`pl-${level}`} style="list" {...current} />
                        {fileStr(cur.children)}
                    </React.Fragment>) : null}
                </div>
            ))
        }
        return (
            <div className={classes.backdrop}>
                <div className={classes.wrapper + ' animated fadeIn ' + (!this.state.showSplashScreen ? classes.light : null)}>
                    <div className={classes.statusbar}>
                        <div className="px-1">
                            {this.state.showSplashScreen ? null : <i className={classes.file + " fas fa-file px-2"}></i>}
                            <img src='/img/logo/gppcr-logo-small.png' style={{ height: '80%' }} alt="" />
                        </div>
                        <div>

                            <button title="minimize" className={[classes.sBtn].join(' ')}><i className="fal fa-window-minimize"></i></button>
                            <button title="maximize" className={[classes.sBtn].join(' ')}><i className="fal fa-xs fa-window-maximize fa-xm"></i></button>
                            <button title="close" className={[classes.btnCancel, classes.sBtn].join(' ')}><i className="fal fa-times"></i></button>
                        </div>
                    </div>

                    {this.state.showSplashScreen ? <div style={{ height: 'calc(100% - 1.8rem)' }} className="d-flex align-items-center justify-content-center">
                        <img style={{ height: '3rem' }} src="/img/logo/gppcr-logo.png" alt="" />
                        <h3 className="pl-3 text-white">Files by GPPCR </h3>

                    </div> : <React.Fragment>
                            <div className={classes.toolbar}>
                                <div className={classes.arrows}>

                                    <button><i className="far fa-arrow-left fa-xs"></i> </button>
                                    <button className={classes.active}> <i className="far fa-arrow-right fa-xs"></i> </button>
                                </div>
                                <div className={classes.urlBox}>
                                    <i className={classes.file + " fad fa-file "}></i>
                                </div>
                                <form className={classes.searchBox}>
                                    <input type="search" placeholder="Search..." />
                                    <button >
                                        <i className={" fas fa-search fa-xs"}></i>
                                    </button>
                                </form>
                            </div>
                            <div className="d-flex" style={{ height: "calc(100% - 5rem)" }}>
                                <div className={classes.sideNav}>
                                    {fileStr(this.state.structure)}
                                </div>
                                <div className={classes.content}>
                                    <div className="row">
                                        {this.state.structure.map(cur => <div className="col-2"> <Folder {...cur} /> </div>)}

                                    </div>
                                </div>
                            </div>
                        </React.Fragment>}
                </div>
            </div>
        )
    }
}

export default explorer
