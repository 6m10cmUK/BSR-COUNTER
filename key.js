$(document).ready(function() {
    $(document).keydown(function(event) {
        if ((event.keyCode >= 49 && event.keyCode <= 56) || (event.keyCode >= 97 && event.keyCode <= 104)) {
            var numberPressed = (event.keyCode >= 97) ? event.keyCode - 96 : event.keyCode - 48;

            const bullet_count = get_bullet_count();
            const true_set = bullet_count[0];
            const false_set = bullet_count[1];

            if(true_set == 0 && false_set == 0) {
                set_bullet_count(numberPressed);
                return;
            }

            if(true_set != 0 && false_set == 0) {
                set_bullet_count(true_set + numberPressed);
                return;
            }

            set_prediction_bullet_status(numberPressed - 1);
        }

    }); 

    $(document).on('keydown', function(event) {
        if (event.key === "r" || event.key === "R") {
            reverse();
        }
        if (event.key === "Escape") {
            reset();
        }
        if (event.key === " " && event.shiftKey) {
            fire(false);
        } else if (event.key === " ") {
            fire();
        }
    });
});