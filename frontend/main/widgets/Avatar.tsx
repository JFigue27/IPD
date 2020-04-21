import 'isomorphic-fetch';
import React, { Component } from 'react';
import { Button, Typography, Grid, Icon, IconButton, Link, Avatar, ButtonBase } from '@material-ui/core';
import Dropzone from 'react-dropzone';
import AppConfig from '../core/AppConfig';
import AuthService from '../core/AuthService';
import Attachments from './Attachments';

const activeStyle = {
  borderColor: '#2196f3'
};

const Request = async (method: string, endpoint: string, data: any, BaseURL?: string) => {
  if (AuthService.auth == null) AuthService.fillAuthData();
  if (!AuthService.auth || !AuthService.auth.user) throw 'User not signed in.';

  const config: RequestInit = {
    method: method,
    mode: 'cors',
    // cache: 'no-cache',
    headers: {
      // 'Content-Type': 'application/json',
      Authorization: `Bearer ${AuthService.auth.user.BearerToken}`
    },
    body: data
  };
  // if (['POST', 'PUT', 'DELETE'].includes(method)) config.body = JSON.stringify(data);
  let response = await fetch((BaseURL || AppConfig.BaseURL) + endpoint, config);
  if (response) {
    if (!response.ok) throw await response.json();
    if (response.status == 403) alert('Invalid Role.');
    if (response.status == 401) throw response;
  } else {
    alert('Failed to fetch. Probably server is down.');
  }
  try {
    const result = await response.json();
    return result;
  } catch (e) {
    return null;
  }
};

interface AvatarProps {
  owner: any;
  listBind?: string;
  folderBind?: string;
  kind?: string;
  onChange?: any;
  readOnly?: boolean;
  printMode?: boolean;
  afterDelete?: any;
  directUpload?: boolean;
  avatarStyle?: any;
}

class AvatarWidget extends Component<AvatarProps> {
  state = {
    files: [],
    targetFolder: '',
    uploading: false
  };

  el: any;
  Kind: string;

  constructor(props) {
    super(props);
    this.el = React.createRef();
  }

  updateFiles = from => {
    let files = [...from];
    this.setState({ files });
  };

  componentDidMount() {
    let { owner = {}, listBind = 'Avatars' } = this.props;
    if (owner[listBind]) {
      this.updateFiles(owner[listBind]);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { uploading } = this.state;
    if (uploading) return;

    const { files: prevFiles, targetFolder: prevTargetFolder } = prevState;

    let { owner = {}, listBind = 'Avatars', folderBind = 'AvatarFolder' } = this.props;

    let targetFolder = owner[folderBind];
    if (targetFolder != prevTargetFolder) {
      this.setState({ targetFolder });
    }

    let files = owner[listBind];
    if (files && files.length != prevFiles.length) {
      this.updateFiles(files);
      return;
    }

    //TODO: Verify comparision:
    // if (files !== prevFiles) {
    //   console.log('files !== prevFiles, updating...');
    //   this.updateFiles(files);
    // }
  }

  onFilesAdded = addedFiles => {
    let { kind = 'Avatar', onChange, listBind = 'Avatars', directUpload, folderBind = 'AvatarFolder' } = this.props;
    let { files, targetFolder } = this.state as any;

    let adaptedAddedFiles = addedFiles.map(file => {
      file.FileName = file.name;
      file.Directory = targetFolder;
      file.AttachmentKind = kind;
      file.isForUpload = true;
      return file;
    });

    files = [...files, ...adaptedAddedFiles];
    this.updateFiles(files);

    if (onChange) onChange(files, listBind, folderBind, targetFolder, directUpload, kind);
  };

  uploadFiles = async files => {
    const { owner, listBind = 'Avatars', folderBind = 'AvatarFolder', onChange } = this.props;
    files = files || this.state.files;

    this.setState({ uploading: true });

    let filesToUpload = files.filter(file => file.isForUpload);
    try {
      for (let [index] of filesToUpload.entries()) {
        await this.sendRequest(index, filesToUpload);
      }

      files = [...this.state.files];
      let { targetFolder } = this.state;

      if (onChange) onChange(files, listBind, folderBind, targetFolder);
      return owner;
    } catch (e) {
      console.log(e);
      alert(JSON.stringify(e, null, 3));
    } finally {
      this.setState({ uploading: false });
    }
  };

  sendRequest = (index, arrToUpload) => {
    let file = arrToUpload[index];
    let { files, targetFolder } = this.state;

    const formData = new FormData();
    formData.append('file', file, file.FileName);
    formData.append('AttachmentKind', this.Kind);
    formData.append('TargetFolder', targetFolder);

    return Request('POST', 'Attachment.json', formData)
      .then(response => {
        let updatedFile;
        let updatedFiles = files.map((f: any) => {
          if (f.FileName == file.FileName) {
            updatedFile = { ...f };
            updatedFile.isForUpload = false;
            return updatedFile;
          }
          return f;
        });
        if (targetFolder != response.Directory) {
          this.setState({ targetFolder: response.Directory });
        }
        this.updateFiles(updatedFiles);
        return updatedFile;
      })
      .catch(() => (file.status = 'error'));
  };

  openDialog = () => {
    let { readOnly } = this.props;
    !readOnly && this.el.current.open && this.el.current.open();
  };

  removeFile = (file, index) => {
    const { listBind = 'Avatars', onChange } = this.props;
    let { files } = this.state;
    let updatedFiles;
    if (file.isForUpload) updatedFiles = files.filter((f, i) => i != index);
    else
      updatedFiles = files.map((f: any, i: number) => {
        if (i == index) {
          let updatedFile = { ...f };
          updatedFile.ToDelete = true;
          return updatedFile;
        }
        return f;
      });

    this.updateFiles(updatedFiles);
    if (onChange) onChange(updatedFiles, listBind);
  };

  directRemove = file => {
    let { onChange, listBind = 'Avatars' } = this.props;
    const avatar = { ...file };
    avatar.ImageBase64 = null;
    if (confirm('Are you sure you want to remote current avatar?')) {
      console.log('Remove Avatar', avatar);
      return Request('POST', `Attachment/delete/${this.Kind}/${avatar.Directory}/${avatar.FileName}`, {})
        .then(response => {
          let emptyFiles = [];
          if (onChange) onChange(emptyFiles, listBind);
          this.updateFiles(emptyFiles);
        })
        .catch(ex => console.log(ex));
    }
  };

  cancelRemove = (file, index) => {
    const { listBind = 'Avatars', onChange } = this.props;
    let { files } = this.state as any;
    let updatedFiles = files.map((f, i) => {
      if (i == index) {
        let updatedFile = { ...f };
        updatedFile.ToDelete = false;
        return updatedFile;
      }
      return f;
    });
    this.updateFiles(updatedFiles);
    if (onChange) onChange(updatedFiles, listBind);
  };

  render() {
    let { files } = this.state as any;
    let {
      owner = {},
      kind = 'Avatar',
      onChange,
      afterDelete,
      listBind = 'Avatars',
      folderBind = 'AvatarFolder',
      printMode,
      readOnly,
      avatarStyle = {}
    } = this.props;

    const api = 'api_' + listBind;
    owner[api] = {};
    owner[api].uploadFiles = this.uploadFiles;

    this.Kind = kind;

    const firstOne = owner[listBind] ? owner[listBind][0] : {};

    return (
      <Grid item xs style={{ marginTop: 5 }}>
        <Dropzone
          ref={this.el}
          multiple
          onDrop={this.onFilesAdded}
          noClick
          onDragEnter={() => this.setState({ border: 'blue' })}
          onDragLeave={() => this.setState({ border: '#e0e0e0' })}
          onDropAccepted={() => this.setState({ border: '#e0e0e0' })}
          onDropRejected={() => this.setState({ border: '#e0e0e0' })}
        >
          {({ getRootProps, getInputProps }) => (
            <Grid
              container
              direction='column'
              {...getRootProps()}
              className='Attachments'
              style={{ borderColor: (this.state as any).border }}
              tabIndex={-1}
              onDoubleClick={this.openDialog}
            >
              <input {...getInputProps()} style={{ display: 'none' }} />
              {firstOne && firstOne.ImageBase64 ? (
                <ButtonBase onClick={() => this.directRemove(firstOne)}>
                  <Avatar style={avatarStyle} src={`data:image/png;base64,${firstOne.ImageBase64}`} alt='Avatar' />
                </ButtonBase>
              ) : (
                <ButtonBase onClick={this.openDialog}>
                  <Avatar style={avatarStyle} />
                </ButtonBase>
              )}
            </Grid>
          )}
        </Dropzone>
      </Grid>
    );
  }
}

export default AvatarWidget;
