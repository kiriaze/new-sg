// TODO! add formfiles to submit data

class DragDropUpload {

	constructor(el) {
		this.$el      = el;
		this.$input   = el.find('input');
		this.$label   = el.find('label');
		this.$preview = el.find('.preview-zone');
		this.$window  = $(window);

		this.multipleFiles = el.data('multiple-files') || false;
		this.maxFiles      = el.data('max-files') || 6;

		this.reader;

		try {
			this.reader = new FileReader();
		} catch (e) {
			console.warn('No FileReader support');
		}

		this.formfiles = [],
		this.queuing   = [],
		this.reading   = false;

		this.addEventListeners();
	}

	addFiles(files) {
		if(this.formfiles.length < this.maxFiles) {
			let legal = files.length + this.formfiles.length > this.maxFiles ? this.maxFiles - this.formfiles.length : files.length
			for (var i = 0; i < legal; ++i) {
				this.formfiles.push(files[i]);
				this.queuing.push(files[i]);
			}
			if (this.reader && !this.reading) this.readFiles();
		}
	}

	removeFile(index) {
		this.$preview.find('li').eq(index).remove();
		this.formfiles.splice(index, 1);
		if(!this.formfiles.length) this.$el.removeClass('has-files');
	}

	readFiles() {
		this.reading = true;
		let file = this.queuing[0];
		this.reader.onload = (e) => {
			if(file.type.indexOf('video') > -1) {
				this.appendVideo(e.target.result);
			} else {
				this.appendThumb(e.target.result);
			}
			this.$el.addClass('has-files');
			this.queuing.shift();
			this.queuing.length ? this.readFiles() : this.reading = false;
		}
		this.reader.readAsDataURL(file);
	}

	appendThumb(src) {
		let $li = $('<li><div style="background-image:url(' + src + ');"><a href="javascript:;" class="delete">' + this.$el.data('remove-label') + '</a></div></li>');
		$li.find('.delete').on('click', this.previewOnDelete);
		this.$preview.append($li);
	}

	appendVideo(src) {
		let video = document.createElement('video'),
			$li = $('<li><div><a href="javascript:;" class="delete">' + this.$el.data('remove-label') + '</a></div></li>');
		$(video).prop('autoplay', true).prop('loop', true).attr({'src': src, 'muted': true});
		$li.find('div').prepend(video);
		$li.find('.delete').on('click', this.previewOnDelete);
		this.$preview.append($li);
	}

	// events
	inputOnChange(e) {
		if (e.target.files && e.target.files.length) this.addFiles(e.target.files);
	}

	windowOnDragEnter(e) {
		e.preventDefault();
		e.stopPropagation();
	}

	labelOnDragOver(e) {
		e.preventDefault();
		e.stopPropagation();
		this.$label.addClass('hover');
	}

	labelOnDragLeave(e) {
		this.$label.removeClass('hover');
	}

	labelOnDrop(e) {
		e.preventDefault();
		this.addFiles(e.originalEvent.dataTransfer.files);
		this.labelOnDragLeave();
	}

	previewOnDelete(e) {
		let index = $(e.currentTarget).closest('li').index();
		this.removeFile(index);
	}

	addEventListeners() {
		this.inputOnChange = this.inputOnChange.bind(this);
		this.windowOnDragEnter = this.windowOnDragEnter.bind(this);
		this.labelOnDragOver = this.labelOnDragOver.bind(this);
		this.labelOnDragLeave = this.labelOnDragLeave.bind(this);
		this.labelOnDrop = this.labelOnDrop.bind(this);
		this.previewOnDelete = this.previewOnDelete.bind(this);

		this.$input.on('change', this.inputOnChange);
		this.$window.on('dragenter', this.windowOnDragEnter);
		this.$label
			.on('dragover', this.labelOnDragOver)
			.on('dragleave', this.labelOnDragLeave)
			.on('drop', this.labelOnDrop);
	}

	removeEventListeners() {
		this.$input.off('change', this.inputOnChange);
		this.$window.off('dragenter', this.windowOnDragEnter);
		this.$label
			.off('dragover', this.labelOnDragOver)
			.off('dragleave', this.labelOnDragLeave)
			.off('drop', this.labelOnDrop);
	}

}

module.exports = DragDropUpload;
