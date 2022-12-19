import React from 'react';
import * as IPFS from 'ipfs-core'
import { ethers } from 'ethers';

import Artifact from '../contracts/Storage.json';
import contractAddress from '../contracts/contract-address.json';

import { Loading } from './Loading';

import all from 'it-all'
import { concat } from 'uint8arrays/concat'


/**
 * A component that implements the basic logic of image manipulation
 * and provides a div with this functionality.
 */
export class Storage extends React.Component {
    constructor(props) {
        super(props);

        this.initialState = {
            file: null,
            image: null,
            url: null,
            node: undefined
        };
        this.state = this.initialState;

        this._provider = new ethers.providers.JsonRpcBatchProvider("http://127.0.0.1:8545/");
        this._contract = new ethers.Contract(
            contractAddress.Storage,
            Artifact.abi,
            this._provider.getSigner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
        )

        this._nodeBeingCreated = false;

        this._handleFile = this._handleFile.bind(this);
        this._removeFile = this._removeFile.bind(this);

        this._uploadCallback = this._uploadCallback.bind(this);
        this._downloadCallback = this._downloadCallback.bind(this);
    }

    render() {
        if (!this._nodeReady()) {
            this._prepareIpfsClient();
            return <Loading />;
        }
        if (this._fileUploaded()) {
            return (
                <div className='file-upload'>
                    <button className='file-upload-btn' type='button' onClick={this._uploadCallback}>Upload</button>
                    <div className='file-upload-content'>
                        <img className='file-upload-image' src={this.state.url} alt='' />
                        <div className='image-title-wrap'>
                            <button type='button' onClick={this._removeFile} className='remove-image'>
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
        if (this._fileDownloaded()) {
            return (
                <div className='file-upload'>
                    <div className='file-upload-content'>
                        <button className='remove-downloaded-btn' type='button' onClick={this._removeFile}>Remove</button>
                        <img className='file-upload-image' src={this.state.image} alt='' />
                    </div>
                </div>
            )
        }
        return (
            <div className='file-upload'>
                <button className='file-upload-btn' type='button' onClick={this._downloadCallback}>Download</button>
                <div className='image-upload-wrap'>
                    <input className='file-upload-input' type='file' onChange={this._handleFile} accept='image/png' />
                    <div className='drag-text'>
                        <h3>Drag and drop a file or select PNG Image from computer</h3>
                    </div>
                </div>
            </div>
        );
    }

    async _handleFile(event) {
        this.setState({
            file: event.target.files[0],
            url: await this._readDataUrlAsync(event.target.files[0])
        });
    }

    async _readDataUrlAsync(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            }
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    _removeFile() {
        this.setState({
            file: null,
            url: null,
            image: null,
        })
    }

    async _uploadCallback() {
        const cid = await this._uploadFile(this.state.file);
        await this._contract.setFile(cid.toString());
        this._removeFile();
    }

    async _uploadFile(file) {
        const content = await this._readFileAsync(file);
        const result = await this.state.node.add(content);
        return result.cid;
    }

    async _downloadCallback() {
        const cid = await this._contract.getFile();

        const generator = this.state.node.cat(cid);
        const packets = await all(generator);
        const bytes = concat(packets);

        const image = new Blob([bytes.buffer], { type: "image/png" });
        const url = window.URL.createObjectURL(image);
        this.setState({ file: null, url: null, image: url })
    }

    async _readFileAsync(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        })
    }

    _nodeReady() {
        return this.state.node !== undefined;
    }

    _prepareIpfsClient() {
        if (this._nodeBeingCreated) {
            return;
        }
        this._nodeBeingCreated = true;
        this._createIpfsClient();
    }

    async _createIpfsClient() {
        this.setState({
            node: await IPFS.create()
        });
    }

    _fileUploaded() {
        return this.state.file !== null;
    }

    _fileDownloaded() {
        return this.state.image !== null;
    }
}
