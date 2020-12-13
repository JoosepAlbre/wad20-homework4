import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Posts from "../../src/components/Posts.vue";
import { post } from '../../../backend/routes/posts';
import moment from 'moment';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

//Create dummy store
const store = new Vuex.Store({
    state: {
        user: {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            avatar: 'test',
        }
    },
    getters: {
        user: (state) => state.user,
    }
});

//Create dummy routes
const routes = [{
        path: '/',
        name: 'posts',
    },
    {
        path: '/profiles',
        name: 'profiles'
    }
];

const router = new VueRouter({ routes });

const testData = [{
        id: 1,
        text: "I think it's going to rain",
        createTime: "2020-12-05 13:53:23",
        likes: 0,
        liked: false,
        media: {
            url: "test-image.jpg",
            type: "image"
        },
        author: {
            id: 2,
            firstname: "Gordon",
            lastname: "Freeman",
            avatar: 'avatar.url'
        }
    },
    {
        id: 2,
        text: "Which weighs more, a pound of feathers or a pound of bricks?",
        createTime: "2020-12-05 13:53:23",
        likes: 1,
        liked: true,
        media: null,
        author: {
            id: 3,
            firstname: "Sarah",
            lastname: "Connor",
            avatar: 'avatar.url'
        }
    },
    {
        id: 4,
        text: null,
        createTime: "2020-12-05 13:53:23",
        likes: 3,
        liked: false,
        media: {
            url: "test-video.mp4",
            type: "video"
        },
        author: {
            id: 5,
            firstname: "Richard",
            lastname: "Stallman",
            avatar: 'avatar.url'
        }
    }
];

//Mock axios.get method that our Component calls in mounted event
jest.mock("axios", () => ({
    get: () => Promise.resolve({
        data: testData
    })
}));

describe('Posts', () => {

    const wrapper = mount(Posts, { router, store, localVue });

    it('Exactly as many posts are rendered as in testData', function() {
        const testPosts = testData.length;
        const renderedPosts = wrapper.findAll('.post').length;
        expect(renderedPosts).toBe(testPosts);
    });


    it('Check the media tags', function() {
        const posts = wrapper.findAll('.post');
        for (let i = 0; i < posts.length; i++) {
            if (testData[i].media) {
                if (testData[i].media.type === "image") {
                    //console.log("Is an image: " + posts.at(i).find('.post-image').find('img').exists());
                    expect(posts.at(i).find('.post-image').find('img').exists()).toBe(true);
                } else if (testData[i].media.type == "video") {
                    //console.log("is a video: " + posts.at(i).find('.post-image').find('video').exists())
                    expect(posts.at(i).find('.post-image').find('video').exists()).toBe(true);
                }
            } else {
                //console.log("Media is null: " + (!posts.at(i).find(".post-image").exists()))
                expect(posts.at(i).find(".post-image").exists()).toBe(false);
            }

        }
    })


    it('Is the post create time in the correct format', function() {
        const dates = wrapper.findAll('.post-author')
        for (let i = 0; i < dates.length; i++) {
            //console.log(dates.at(i).findAll('small').at(1).text() + " ||| " + moment(testData[i].createTime).format('LLLL'));
            expect(dates.at(i).findAll('small').at(1).text()).toEqual(moment(testData[i].createTime).format('LLLL'));

        }

    });

});