function Sticky (domElement, options){
  this.$el = domElement;
  this.parent = this.$el.parent();
  this.STICK_AT = options.at;
  this.reverse = false;
  if(options.reverse) {
    this.reverse = true;
  }

  if(options.position){
    this.STICK_POS = options.position
  } else {
    this.STICK_POS = 0
  }
  this.window = $(window)
  this.fixed = false

  this.onScroll = function(){
    if(this.window.scrollTop() >= this.STICK_AT && this.fixed === false) {
      this.fixed = true;

      if(!options.floating) {
        this.$el.css({
          "position":"fixed",
          "top": this.STICK_POS,
          "z-index":1000
        })
        $("body").append(this.$el)
      } else {
        if(this.reverse) {
          this.$el.removeClass("show")
        } else {
          this.$el.addClass("show")
        }
      }
    } else if(this.window.scrollTop() < this.STICK_AT) {
      if(!options.floating) {

        $("body").append(this.$el)
        this.$el.css({
          "position":"",
          "top": "",
          "z-index":""
        })
        this.parent.append(this.$el);
      } else {
         if(this.reverse) {
          this.$el.addClass("show")
         } else {
          this.$el.removeClass("show")
         }
      }
      this.fixed = false;
    }
  }

  $(window).on("scroll", this.onScroll.bind(this))
  this.onScroll();

  return this.clone;
}

window.Sticky = Sticky;