<template>
    <div class="page-container">
        <md-app md-waterfall md-mode="fixed">
            <md-app-toolbar class="md-primary">

                <h3 class="md-title">Face Chat</h3>

                <!--
                <md-button class="md-icon-button">
                    <md-icon>more_vert</md-icon>
                </md-button>
                -->
            </md-app-toolbar>

            <!--
              <md-app-drawer md-permanent="full">
                <md-toolbar class="md-transparent" md-elevation="0">
                  Navigation
                </md-toolbar>

                <md-list>
                  <md-list-item>
                    <md-icon>move_to_inbox</md-icon>
                    <span class="md-list-item-text">Inbox</span>
                  </md-list-item>

                  <md-list-item>
                    <md-icon>send</md-icon>
                    <span class="md-list-item-text">Sent Mail</span>
                  </md-list-item>

                  <md-list-item>
                    <md-icon>delete</md-icon>
                    <span class="md-list-item-text">Trash</span>
                  </md-list-item>

                  <md-list-item>
                    <md-icon>error</md-icon>
                    <span class="md-list-item-text">Spam</span>
                  </md-list-item>
                </md-list>
              </md-app-drawer>
              -->

            <md-app-content v-chat-scroll="{ always: false, smooth: true }">

                <!-- <div style="width: 100%;height: 50px;">&nbsp;</div> -->

                <div
                    class="md-layout"
                    v-for="message in messages"
                    v-bind:key="message.id"
                >
                    <div class="md-layout-item avatar-box">
                        <md-avatar class="md-avatar-icon">
                          <img width="40" height="30" :src="message.icon" v-if="message.icon" />
                        </md-avatar>
                    </div>

                    <div class="md-layout-item">
                        <p>{{ message.text }}</p>
                    </div>
                </div>

                <div style="width: 100%;height: 60px;">&nbsp;</div>
            </md-app-content>

        </md-app>

    <div class="bottom-bar">
        <form class="md-layout" @submit.prevent="submitMessage">
            <div class="md-layout-item avatar-box" style="margin-left: 15px">
                <md-avatar class="md-avatar-icon">
                   <canvas width="40" height="40"></canvas>
                   <video width="40" height="40" style="display: none" playsinline="true" autoplay="true" muted="true"></video>
                </md-avatar>
            </div>

            <div class="md-layout-item">
                <md-field md-inline> <!--  md-autogrow -->
                  <md-input v-model="messageText" placeholder="Type here!"></md-input>
                </md-field>
            </div>

            <div class="md-layout-item send-box">
                <md-button class="md-raised md-primary" @click="submitMessage">Send!</md-button>
            </div>

        </form>
    </div>

    </div>
</template>

<script>
/* eslint-disable new-cap */

import moment from 'moment';

export default {
    data() {
        return {
            messageText: null,
            messages: []
        };
    },
    mounted() {
        if (typeof window === 'undefined') {
            return;
        }

        let vm = this;

        vm.$nextTick(() => {

            // https://codingthesmartway.com/building-a-real-time-chat-application-with-vue-js-and-firebase-part-2/
            let messageCollection = vm.$fireStore.collection('messages').orderBy('time').limit(25);

            messageCollection.onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        let doc = change.doc;
                        vm.messages.push({
                            id: doc.id,
                            name: doc.data().name,
                            text: doc.data().text,
                            time: moment(doc.data().time).format('LTS'),
                            icon: doc.data().icon
                        });
                    }
                });
            });

            setTimeout(() => {
                vm.$el.querySelector('input').focus();
            },500);

        });

    },
    methods: {
        submitMessage() {
            let vm = this;

            if (vm.messageText) {
                vm.$fireStore.collection('messages').add({
                    text: vm.messageText,
                    name: 'Someone',
                    icon: vm.canvas.toDataURL(),      
                    time: Date.now()
                }).catch(err => {
                    console.log(err);
                });
            }

            vm.messageText = null;
        }
    }
};
</script>

<style scoped lang="scss">
.avatar-box {
    width: 50px;
    height: 50px;
    flex: 0 1 50px;
}

.send-box {
    width: 105px;
    height: 50px;
    flex: 0 1 105px;
}

.md-app-toolbar {
    position: fixed;
    top: 0;
}

.bottom-bar {
    width: 100%;
    height: 60px;
    position: fixed;
    background-color: white;
    bottom: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.12);

    .md-field {
        position: relative;
        top: -12px;
        margin: 5px;
    }
}

.md-content {
    height: 100vh;
    overflow-y: scroll;
}

p,
.md-avatar-icon {
    margin-top: 5px;
    margin-bottom: 5px;
}

.md-toolbar {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

/*
// Demo purposes only
.md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
}*/
</style>
