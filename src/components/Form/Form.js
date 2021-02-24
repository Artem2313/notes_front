import React, {useState, useEffect} from 'react';
import {TextField, Button, Typography, Paper} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import FileBase from 'react-file-base64';

import useStyles from './styles';
import {createPost, updatePost} from '../../redux/actions/posts';

const Form = ({currentId, setCurrentId}) => {
  const [postData, setPostData] = useState({creator: '', title: '', message: '', tags: '', selectedFile: ''});
  const post = useSelector((state) => (currentId ? state.posts.find((message) => message._id === currentId) : null));
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const clear = () => {
    setCurrentId(0);
    setPostData({creator: '', title: '', message: '', tags: '', selectedFile: ''});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      dispatch(createPost(postData));
      clear();
    } else {
      dispatch(updatePost(currentId, postData));
      clear();
    }
  };

  const handleChange = (e) => {
    if (e.target.name === '' || e.target.name === null || e.target.name === undefined) {
      return;
    } else if (e.target.name === 'tags') {
      setPostData({ ...postData, [e.target.name]: e.target.value.split(',')})
    } else {
      setPostData({...postData, [e.target.name]: e.target.value})
    }
  }

  return (
    <Paper className={classes.paper}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit} onChange={handleChange}>
        <Typography variant="h6">{currentId ? `Editing "${post.title}"` : 'Creating a Note'}</Typography>
        <TextField name="creator" variant="outlined" label="Creator" fullWidth value={postData.creator} />
        <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} />
        <TextField name="message" variant="outlined" label="Message" fullWidth multiline rows={4} value={postData.message} />
        <TextField name="tags" variant="outlined" label="Tags (coma separated)" fullWidth value={postData.tags} />
        <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({base64}) => setPostData({...postData, selectedFile: base64})} /></div>
        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
        <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
      </form>
    </Paper>
  );
};

export default Form;