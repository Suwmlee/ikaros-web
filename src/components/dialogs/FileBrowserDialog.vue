<template>
  <transition name="dialog-fade">
    <div class="dialog-backdrop">
      <div class="dialog"
        role="dialog"
        aria-labelledby="dialogTitle"
        aria-describedby="dialogDescription"
      >
        <header
          class="dialog-header"
          id="dialogTitle"
        >
          <slot name="header">
            This is the default tile!
          </slot>
          <button
            type="button"
            class="btn-close"
            @click="close"
            aria-label="Close dialog"
          >
            x
          </button>
        </header>

        <section
          class="dialog-body"
          id="dialogDescription"
        >
          <slot name="body">
            This is the default body!
          </slot>
        </section>

        <footer class="dialog-footer">
          <slot name="footer">
            This is the default footer!
          </slot>
          <button
            type="button"
            class="btn-green"
            @click="close"
            aria-label="Close dialog"
          >
            Close me!
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'FileBrowserDialog',
    data() {
        return{
            selectedPath: 'testpath'
        }
    },
    methods: {
      close() {
        this.$emit('close');
        this.$emit('update:path', this.selectedPath)
      },
    },
  };
</script>

<style>
  .dialog-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dialog {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  }

  .dialog-header,
  .dialog-footer {
    padding: 15px;
    display: flex;
  }

  .dialog-header {
    position: relative;
    border-bottom: 1px solid #eeeeee;
    color: #4AAE9B;
    justify-content: space-between;
  }

  .dialog-footer {
    border-top: 1px solid #eeeeee;
    flex-direction: column;
  }

  .dialog-body {
    position: relative;
    padding: 20px 10px;
  }

  .btn-close {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
  }

  .btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
  }

  .dialog-fade-enter,
  .dialog-fade-leave-to {
    opacity: 0;
  }

  .dialog-fade-enter-active,
  .dialog-fade-leave-active {
    transition: opacity .5s ease;
  }
</style>
