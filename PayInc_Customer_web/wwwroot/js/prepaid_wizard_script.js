$(document).ready(function () {
    var _validations = [];
    var _formEl = KTUtil.getById('kt_form');
    _validations.push(FormValidation.formValidation(
        _formEl,
        {
            fields: {
                mobilenumber: {
                    validators: {
                        notEmpty: {
                            message: 'Please enter Mobile Number'
                        },
                        stringLength: {
                            min: 10,
                            max: 10,
                            message: 'Please enter valid 10 digit Mobile Number'
                        },
                        regexp: {
                            regexp: /^[0-9]+$/,
                            message: 'Please enter valid Mobile Number'
                        }
                    }
                }
            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap()
            }
        }
    ));

    _validations.push(FormValidation.formValidation(
        _formEl,
        {
            fields: {
                // Step 2
                operator: {
                    validators: {
                        choice: {
                            min: 1,
                            message: 'Please select Opterator.'
                        }
                    }
                }
            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap()
            }
        }
    ));

    _validations.push(FormValidation.formValidation(
        _formEl,
        {
            fields: {
                amount: {
                    validators: {
                        notEmpty: {
                            message: 'Please enter amount'
                        }
                    }
                },
                stringLength: {
                    min: 2,
                    max: 15,
                    message: 'Please enter valid amount'
                },
                regexp: {
                    regexp: /^[0-9]+$/,
                    message: 'Please enter valid amount'
                }
            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap()
            }
        }
    ));
    
    var _wizard1 = new KTWizard("kt_wizard", {
        startStep: 1, // initial active step number
        clickableSteps: true  // allow step clicking
    });


    _wizard1.on('beforeNext', function (wizard) {
        // Don't go to the next step yet
        _wizard1.stop();

        // Validate form
        var validator = _validations[wizard.getStep() - 1]; // get validator for currnt step
        validator.validate().then(function (status) {
            
        });
    });

    $("#kt_form").submit(function (e) {
        e.preventDefault();
    })

    
    $("#btn_step1").click(function (e) {
        e.preventDefault();
        // Validate form
        var validator = _validations[0]; // get validator for currnt step
        validator.validate().then(function (status) {
            if (status === 'Valid') {
                $("#txtShowMobileNo").val($("#txtMobileNo").val());
                $("#lblMobileNo").text($("#txtMobileNo").val());
                GetPLAN($("#txtMobileNo").val(), $("#ddlOperator").val())
                _wizard1.goNext();
            }
        });
    });

    function GetPLAN(mobileno, operatorName) {
        if (mobileno === "") {
            return;
        }
        if (operatorName === "") {
            return;
        }
        var loader = '<div class="spinner spinner-lg spinner-primary mr-15"></div>';
        $("#viewplan_panel").html(loader);
        $.ajax({
            url: '/Recharge/Prepaid/GetMobilePlans',
            type: "POST",
            data: { mobileNumber: mobileno, operatorName: operatorName },
            success: function (data) {
                $("#viewplan_panel").html(data);
            },
            error: function (er) {
                $("#viewplan_panel").html('');
            }
        });
    }


    $("#txtMobileNo").keyup(function () {
        var mobileNumber = $("#txtMobileNo").val();
        if (mobileNumber.length === 10)
        {
            $("#txtShowMobileNo").val($("#txtMobileNo").val());
            $("#lblMobileNo").text($("#txtMobileNo").val());
            _wizard1.goNext();
            GetPLAN($("#txtMobileNo").val(), $("#ddlOperator").val());
        }
    });

    $("#btn_step2").click(function (e) {
        e.preventDefault();
        var validator = _validations[1]; // get validator for currnt step
        validator.validate().then(function (status) {
            if (status === 'Valid') {
                _wizard1.goNext();

            }
        });
    });
    $('.prev-step').click(function (e) {
        _wizard1.goPrev();
    });

    $("#form_recharge").submit(function (e) {
        e.preventDefault();
        if (!$(this).valid()) {
            return;
        }
        $("#lblMobileNo").text($("#txtMobileNo").val());
        $("#lblOperator").text($("#ddlOperator option:selected").text());
        $("#hdnOperator").val($("#ddlOperator option:selected").text());
        $("#lblAmount").text($("#txtamount").val());
        $("#hdnMobileNumber").val($("#txtMobileNo").val());
        $("#hdnOperatorId").val($("#ddlOperator").val());
        $("#hdnAmount").val($("#txtamount").val());
        $('#mymodal').modal('show');
        $("#digit-1").focus();
    });

    
    $(".select-plan").click(function (e) {
        $(this).html('<i class="text-white fa fa-check"></i>');
        $("#txtamount").val($(this).attr("data-amt"));
        $("#lblMobileNo").text($("#txtMobileNo").val());
        $("#lblOperator").text($("#ddlOperator option:selected").text());
        $("#hdnOperator").val($("#ddlOperator option:selected").text());
        $("#lblAmount").text($("#txtamount").val());
        $("#hdnMobileNumber").val($("#txtMobileNo").val());
        $("#hdnOperatorId").val($("#ddlOperator").val());
        $("#hdnAmount").val($("#txtamount").val());
        $("#digit-1").focus();
        $('#mymodal').modal('show');
    });

    $("#ddlOperator").change(function (e) {
        GetPLAN($("#txtMobileNo").val(), $("#ddlOperator option:selected").text())
    });
    
})

