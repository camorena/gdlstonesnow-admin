jQuery(document).ready(function ($) {
  var $form = $("#contact-form");
  var $results = $("#contact_results");
  var $submitBtn = $("#submit_btn");

  function showResult(type, icon, title, message) {
    var bgColor = type === "success" ? "#e8f5e9" : "#fbe9e7";
    var borderColor = type === "success" ? "#8BB63A" : "#d32f2f";
    var titleColor = type === "success" ? "#2e7d32" : "#c62828";

    $results.css({
      "background-color": bgColor,
      "border": "2px solid " + borderColor
    });
    $("#result-icon").html(icon);
    $("#result-title").css("color", titleColor).text(title);
    $("#result-message").css("color", "#555").html(message);
    $results.slideDown();
  }

  $form.on("submit", function (e) {
    e.preventDefault();

    var isValid = true;

    $form.find("input[required], textarea[required]").each(function () {
      var $field = $(this);
      $field.css("background-color", "");

      if (!$.trim($field.val())) {
        $field.css("background-color", "#FFDEDE");
        isValid = false;
      }
    });

    var $email = $form.find("input[type=email]");
    if ($email.length && !/^[\w.-]+@[\w-]+\.[\w-]{2,}$/.test($.trim($email.val()))) {
      $email.css("background-color", "#FFDEDE");
      isValid = false;
    }

    if (!isValid) return;

    $submitBtn.prop("disabled", true).text("Sending...");

    var params = {};
    $form.find("input, textarea").each(function () {
      if (this.name) params[this.name] = $.trim($(this).val());
    });

    emailjs.send("service_r6kvm1r", "template_ygg00i5", params).then(
      function () {
        $form.slideUp();
        showResult(
          "success",
          "&#10004;",
          "We've Received Your Request",
          "Thank you, <strong>" + params.name + "</strong>. Our team is reviewing your inquiry and will reach out to you within one business day to discuss your project.<br><br>For immediate assistance, call us at <a href='tel:9528826182' style='color:#8BB63A;font-weight:bold;'>(952) 882-6182</a>."
        );

        setTimeout(function () {
          $results.slideUp(function () {
            $form[0].reset();
            $submitBtn.prop("disabled", false).text("Send message");
            $form.slideDown();
          });
        }, 8000);
      },
      function () {
        showResult(
          "error",
          "&#10006;",
          "Unable to Submit Your Request",
          "We apologize for the inconvenience. Please try again in a moment or reach us directly at <a href='tel:9528826182' style='color:#8BB63A;font-weight:bold;'>(952) 882-6182</a> or <a href='mailto:camoren000@gmail.com' style='color:#8BB63A;font-weight:bold;'>camoren000@gmail.com</a>."
        );
        $submitBtn.prop("disabled", false).text("Send message");

        setTimeout(function () {
          $results.slideUp();
        }, 8000);
      }
    );
  });
});
