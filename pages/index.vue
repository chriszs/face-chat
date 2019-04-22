<template>
    <div class="page-container">
        <md-app md-waterfall md-mode="fixed">
            <md-app-toolbar class="md-primary">

                <h3 class="md-title">Face chat</h3>

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
                <div
                    class="md-layout"
                    v-for="message in messages"
                    v-bind:key="message.id"
                >
                    <div class="md-layout-item md-size-10">
                        <md-avatar class="md-avatar-icon">
                          <img width="40" height="30" :src="message.icon" v-if="message.icon" />
                        </md-avatar>
                    </div>

                    <div class="md-layout-item">
                        <p>{{ message.text }}</p>
                    </div>
                </div>
            </md-app-content>

        </md-app>

    <div class="bottom-bar">
        <form class="md-layout" @submit.prevent="submitMessage">
            <div class="md-layout-item md-size-10">
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

            <div class="md-layout-item md-size-20">
                <md-field>
                    <md-button class="md-raised md-primary" @click="submitMessage">Send!</md-button>
                </md-field>
            </div>

        </form>
    </div>

    </div>
</template>

<script>
/* eslint-disable new-cap */
// import clm from 'clmtrackr';

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

        let requestAnimationFrame = window.requestAnimationFrame;

        // https://wybiral.github.io/code-art/projects/tiny-mirror/index.js
        // and https://www.auduno.com/clmtrackr/examples/facedeform.html
        vm.$nextTick(() => {

            // https://codingthesmartway.com/building-a-real-time-chat-application-with-vue-js-and-firebase-part-2/
            let messageCollection = vm.$fireStore.collection('messages').orderBy('time');

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

            vm.canvas = vm.$el.querySelector('canvas');
            let video = vm.$el.querySelector('video');

            const ctx = vm.canvas.getContext('2d');

            // let ctrack = new clm.tracker();
            // ctrack.init();

            const drawLoop = () => {
                // Copy video to canvas
                // ctx.clearRect(0, 0, vm.canvas.width, vm.canvas.height);
                //console.log(Math.round((video.width-vm.canvas.width)/2), 0, vm.canvas.width, vm.canvas.height, 0, 0, vm.canvas.width, vm.canvas.height);
                let proportion = video.videoWidth/video.videoHeight;
                let videoWidth = Math.round(vm.canvas.height * proportion);
                let scale = video.videoWidth/videoWidth;
                ctx.scale(-1, 1);
                ctx.drawImage(video, Math.round(((videoWidth-vm.canvas.width)/2)*scale), 0, Math.round(vm.canvas.width*scale), video.videoHeight, 0, 0, vm.canvas.width*-1, vm.canvas.height);

                //if (ctrack.getCurrentPosition()) {
                //    ctrack.draw(vm.canvas);
                //}
                // Set canvas to favicon
                // favicon.setAttribute('href', canvas.toDataURL());
                // Loop
                requestAnimationFrame(drawLoop);
            };

            function adjustVideoProportions() {
                // resize overlay and video if proportions of video are not 4:3
                // keep same height, just change width
                let proportion = video.videoWidth/video.videoHeight;
                let videoWidth = Math.round(vm.canvas.height * proportion);
                video.width = videoWidth;
                // vm.canvas.width = videoWidth;
            }

            // Assign user media to video and start loop
            navigator.mediaDevices.getUserMedia({
                audio: false,
                video: true
            }).then(stream => {
                video.srcObject = stream;
                // video.play();
                // ctrack.start(video);

                video.onloadedmetadata = function() {
                    adjustVideoProportions();
                    video.play();
                }
                video.onresize = function() {
                    adjustVideoProportions();
                    //if (trackingStarted) {
                    //    ctrack.stop();
                    //    ctrack.reset();
                    //    ctrack.start(video);
                    //}
                }

                requestAnimationFrame(drawLoop);
            }).catch(() => {});

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
.bottom-bar {
    width: 100%;
    height: 75px;
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
    height: 85vh;
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

// Demo purposes only
.md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
}
</style>
