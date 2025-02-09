async function controller(req, res) {
  const query = req.query;
  const dirKeys = Object.keys(query);

  let path = '';

  for (let i = 0; i < dirKeys.length; i++) {
    if (i === dirKeys.length - 1) {
      path += query[dirKeys];
    } else {
      path += query[dirKeys] + '/';
    }
  }
  console.log("path -", `songs/static/uploads/frontend/${path}`);
  return res.redirect(`songs/static/uploads/frontend/${path}`);
}


module.exports = controller