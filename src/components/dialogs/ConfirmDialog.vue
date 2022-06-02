<template>
  <el-dialog class="confirm-modal"
             :modal-append-to-body="false"
             :append-to-body="true"
             :visible="isVisible"
             @close="close"
             :before-close="beforeClose"
             v-bind="$attrs">
    <slot>
      <div>
        <span>{{ message }}</span>
      </div>
      <el-checkbox v-model="subcheck">{{ subConfirmMessage }}</el-checkbox>
    </slot>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" @click.native="confirm">
          {{ confirmLabel }}
        </el-button>
        <el-button type="danger" @click.native="close">
          {{ cancelLabel }}
        </el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: "Confirm",
  props: {
    syncViaProps: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ""
    },
    subConfirmMessage: {
      type: String,
      default: ""
    },
    cancelLabel: {
      type: String,
      default: "取消"
    },
    confirmLabel: {
      type: String,
      default: "确认"
    },
    loading: {
      type: Boolean,
      default: false
    },
    closeOnConfirm: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      promise: undefined,
      beforeConfirm: () => {},
      beforeCancel: () => {},
      internalVisible: false,
      subcheck: false,
      resolvePromise: undefined,
      rejectPromise: undefined
    };
  },
  computed: {
    isVisible() {
      return this.visible || this.internalVisible;
    }
  },
  methods: {
    beforeClose(done) {
      done();
      this.updateVisible(false);
    },
    async close() {
      let done = () => {
        this.updateVisible(false);
        this.rejectPromise();
      };

      if (this.isVisible && this.beforeCancel) {
        await this.beforeCancel(done);
      }
      done();
    },
    updateVisible(value) {
      if (this.syncViaProps) {
        this.$emit("update:visible", value);
      } else {
        this.internalVisible = value;
      }
    },
    async confirm() {
      let done = () => {
        this.updateVisible(false);
        this.resolvePromise();
      };
      if (this.beforeConfirm) {
        await this.beforeConfirm(done);
      }
      if (this.closeOnConfirm) {
        done();
      }
    },
    show() {
      this.subcheck = false;
      this.updateVisible(true);
      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve;
        this.rejectPromise = reject;
      });
    }
  }
};
</script>

<style>

 .el-dialog{
      display: flex;
      flex-direction: column;
      margin:0 !important;
      position:absolute;
      top:50%;
      left:50%;
      transform:translate(-50%,-50%);
      /*height:600px;*/
      max-height:calc(100% - 30px);
      /* max-width:calc(100% - 30px); */
      width: 450px;
  }
  .el-dialog .el-dialog__body{
      flex:1;
      overflow: auto;
  }

</style>
