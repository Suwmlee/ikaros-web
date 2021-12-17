<template>
  <div class="body-wrap">
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

.body-wrap{
    margin: 15px 5px 5px 5px;
}

</style>
