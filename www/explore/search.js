import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'
alert('hey!');

new Vue({
  el: "#search-list",
  data: {
    items: [
      {name: "tunivieor's nectar"},
      {name: "gorgon tears"},
      {name: "philosopher's stone"}
    ]
  }
});