var page = {
	init: function() {
		page.bindNavigation();
		page.loadAccountPage();
	},

	bindNavigation: function() {
		$('#switch_settings').bind('click', page.loadSettingsPage);
		$('#switch_account').bind('click', page.loadAccountPage);
	},
	
	hidePages: function() {
		$('.tab').addClass('hidden');
		$('.tabHead').removeClass('active')
	},
	
	showSuccess: function(message) {
		$('#message_success').html(message).fadeIn("fast");
	},

	loadAccountPage: function() {
		page.hidePages();
		$('#switch_account').addClass('active');
		$('#tab_account').removeClass('hidden');

		$('#password').val(localStorage.password);
		$('#email').val(localStorage.email);
		
		$('#settings_save').bind('click', page.saveAccountData);
	},

	saveAccountData: function() {
		localStorage.password = $('#password').val();
		localStorage.email = $('#email').val();
		
		page.showSuccess("Daten erfolgreich gespeichert");
	},

	loadSettingsPage: function() {
		page.hidePages();
		$('#switch_settings').addClass('active');
		$('#tab_settings').removeClass('hidden');
	}
};

$(document).ready(function() {
	page.init();
});