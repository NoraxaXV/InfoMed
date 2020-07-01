
function updateSearchUrl(id, search_key){ // eslint-disable-line no-unused-vars
  let url = `/explore/${search_key}`;
  document.getElementById(id).setAttribute('href', url);
  window.location.href = url;
  return false;
}