"use strict";


define(['jquery', 'underscore', 'backbone', 'baseController', 'pageController'], function($, _, Backbone, BaseController, PageController){

	/**
	 * This is a controller for Hello Tule plugin.
	 * A controller is a special composite view that initialize and coordinates its subviews,
	 * and relies on them for display the UI. It is the logic hub
	 */
	var HelloController = BaseController.extend({
		//Controller template is simple, just some placeholder nodes to place the views
		template: '<div class="hello-left"></div><div class="hello-right">',

		// with the regionSelectors attribute we can create regions easily.
		// BaseController will create one region for each css selector, and they
		// will be available inside the controller in 'this.regions' object
		regionSelectors: {
			left: '.hello-left',
			right: '.hello-right'
		},

		/**
		 * The init method is called just after the BaseController's initialize method.
		 * Use it instead of the usual BB initialize.
		 * @param  {Object} options The options is poblated with the parameters of the URL.
		 * @return {undefined}
		 */
		init: function(options){
			var me = this;
			//First fetch some data from the server
			$.get('/api/hello-tule/getdata', function(data){
				// We are going to create some dumb views to show how different
				// parts of the page are controlled. Those views are defined down in this file
				me.leftView = new HelloButtonView({data: data});
				me.rightView = new TuleImageView();

				//Place the views in their part of the page
				me.regions.left.show(me.leftView);
				me.regions.right.show(me.rightView);

				//The views interact thanks to the events and the controller.
				//let's listen for hellos
				me.listenTo(me.leftView, 'hello', function(data){
					me.rightView.setImageData(data);
				});
			});
		}
	});

	var HelloButtonView = Backbone.View.extend({
		events: {
			'click button': 'sayHello'
		},
		initialize: function(options){
			this.data = options.data;
		},
		sayHello: function(){
			var index = Math.floor(Math.random() * this.data.length);
			this.trigger('hello', this.data[index]);
		},
		render: function(){
			this.$el.html('<button style="font-size: 21px">Say Hello!</button>');
		}
	});

	var TuleImageView = Backbone.View.extend({
		tpl: _.template('<img src="<%= img %>" style="height:200px"><h2>Hello <%= name %>!</h2>'),
		initialize: function(){
			this.model = new Backbone.Model({});
			this.listenTo(this.model, 'change', this.render);
		},
		setImageData: function(data){
			this.model.set(data);
		},
		render: function(){
			if(this.model.get('name'))
				this.$el.html(this.tpl(this.model.toJSON()));
		}
	});

	return PageController.extend({
		title: 'Welcome to Hello Tule',
		contentView: HelloController
	});
});