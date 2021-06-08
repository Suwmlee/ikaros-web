<template>
  <div class="hello">
   <vue-markdown :source="fileContent" class="markdown-body" > </vue-markdown>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import VueMarkdown from 'vue-markdown'
import 'github-markdown-css';

export default {
  name: 'tutorial',
  components: {
    VueMarkdown
  },
    data() {
        return {
            fileContent:'',
        };
    },
  created: function() {
    this.getContent();
  },
  methods: {
    getContent() {
      axios.get('/api/intro')
                .then(response => {
                    console.log(response)
                    this.fileContent = response.data
                })
                .catch(function (error) {
                    console.log(error);
                });
    }
  }
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
