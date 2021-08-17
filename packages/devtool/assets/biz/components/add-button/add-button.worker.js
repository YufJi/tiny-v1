
var globalThis = undefined;
var global = undefined;
var fetch = undefined;
var self = undefined;
var window = undefined;
var document = undefined;
var location = undefined;
var XMLHttpRequest = undefined;

$global.currentComponentConfig = 
{
  is: "/components/add-button/add-button",
  usingComponents: {"add-button":"/components/add-button/add-button"},
};

Component({
  properties: {
    text: {
      type: String,
      value: 'sdas',
    },
  },

  data: {
    // text: 'jyf',
    name: 'xxxxx',
  },

  lifetimes: {
    created() {
      console.log('created', this.properties, this.data);
    },
    attached() {
      console.log('attached', this.properties, this.data);
    },
    ready() {
      console.log('ready', this.properties, this.data);
      console.log('id', this.id)
      console.log('is', this.is)
    },
    moved() {
      console.log('moved', this.properties);
    },
    detached() {
      console.log('detached', this.properties);
    },
  },

  methods: {
    xx() {
      console.log('properties', this.properties, this.data);
    },
    onClickMe() {
      this.setData({
        // text: 'xhq',
        name: 'ooo',
      });
      console.log('properties', this.properties, this.data);
      this.triggerEvent('click_me', { xx: 'xxxx' }, { bubbles: true });
    },
  },
});

  