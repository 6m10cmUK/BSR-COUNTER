var bullet_true = 0;
var bullet_false = 0;

var prediction_bullet_status = [];

var fire_count = 0;

$(document).ready(function() {
    bullet_true = 0;
    bullet_false = 0;

    set();
    $('.bullet').click(function() {
        var index = $(".bullet").index(this) + 1;
        set_bullet_count(index);
    });

    $('.reverse').click(function() {
        reverse();
    });

    $('.reset').click(function() {
        reset();
    });
    $('.fire').click(function() {
        fire();
    });
    $('.undo-fire').click(function() {
        fire(false);
    });
});

function fire(flg = true) {
    if(prediction_bullet_status.length == 0) {
        return;
    }
    if(flg) {
        if((!$('.prediction_bullet').eq(fire_count).hasClass('true') && !$('.prediction_bullet').eq(fire_count).hasClass('false'))){
            return;
        }
        prediction_bullet_status[fire_count].status = true;
        fire_count++;
    }else{
        fire_count--;    
        prediction_bullet_status[fire_count].status = false;  
    }
 
    if(fire_count < 0) {
        fire_count = 0;
    }

    if(fire_count >= bullet_true + bullet_false) {
        fire_count = bullet_true + bullet_false;
    }

    check();
}

function reverse() {
    prediction_bullet_status = prediction_bullet_status.map(status => {
        if (status.type === true) {
            return {type: false, status: status.status};
        } else if (status.type === false) {
            return {type: true, status: status.status};
        } else {
            return status; // nullや他の値はそのまま
        }
    });
    var temp = bullet_true;
    bullet_true = bullet_false;
    bullet_false = temp;

    $('.bullet').removeClass('true false');
    for (var i = 0; i < bullet_true; i++) {
        $('.bullet').eq(i).addClass('true');
    }

    for (var i = bullet_true; i < bullet_true + bullet_false; i++) {
        $('.bullet').eq(i).addClass('false');
    }

    check();

}

function reset() {
    bullet_true = 0;
    bullet_false = 0;
    fire_count = 0;
    prediction_bullet_status = [];
    $('.bullet').removeClass('true false out');
    $('.prediction_magazine').empty().append('<p>1click=true / 2click=false</p>');
    $('.count').text(0);
}

function set() {
    $('.prediction_bullet').click(function() {
        var index = $(".prediction_bullet").index(this);
        set_prediction_bullet_status(index);
    });
}

function set_prediction_bullet_status(index) {
    if($('.prediction_bullet').eq(index).hasClass('out')) {
        return;
    }
    if(prediction_bullet_status[index].type == null) {
        if(prediction_bullet_status.filter(status => status.type === true).length < bullet_true) {   
            prediction_bullet_status[index].type = true;
            $('.prediction_bullet').eq(index).addClass('check');
        }else{
            prediction_bullet_status[index].type = null;
            $('.prediction_bullet').eq(index).removeClass('check');
        }
    } else if(prediction_bullet_status[index].type == true) {
        if(prediction_bullet_status.filter(status => status.type === false).length < bullet_false) {
            prediction_bullet_status[index].type = false;
            $('.prediction_bullet').eq(index).addClass('check');
        }else{
            prediction_bullet_status[index].type = null;
            $('.prediction_bullet').eq(index).removeClass('check');
        }
    } else if(prediction_bullet_status[index].type == false) {
        prediction_bullet_status[index].type = null;
        $('.prediction_bullet').eq(index).removeClass('check');
    }
    check();
}

function check() {
    $('.prediction_magazine .prediction_bullet').removeClass('true').removeClass('false').removeClass('out')
    .each(function(index) {
        if(prediction_bullet_status[index].type == true){
            $(this).addClass('true');
        } else if(prediction_bullet_status[index].type == false) {
            $(this).addClass('false');
        }
        if(prediction_bullet_status[index].status == true) {
            $(this).addClass('out');
        }
    });

    let trueCount = prediction_bullet_status.filter(status => status.type === true).length;
    let falseCount = prediction_bullet_status.filter(status => status.type === false).length;

    if(trueCount == bullet_true) {
        $('.prediction_magazine .prediction_bullet').each(function(index) {
            if(prediction_bullet_status[index].type == null) {
                $(this).addClass('false');
            }
        });
    } else if (falseCount == bullet_false) {
        $('.prediction_magazine .prediction_bullet').each(function(index) {
            if(prediction_bullet_status[index].type == null) {
                $(this).addClass('true');
            }
        });
    }

    let trueOutCount = prediction_bullet_status.filter((status, index) => $('.prediction_magazine .prediction_bullet').eq(index).hasClass('true') && status.status == true).length;
    let falseOutCount = prediction_bullet_status.filter((status, index) => $('.prediction_magazine .prediction_bullet').eq(index).hasClass('false') && status.status == true).length;

    $('.magazine .bullet').removeClass('out');
    for(var i = 0; i < trueOutCount; i++) {
        $('.magazine .bullet').eq(i).addClass('out');
    }
    for(var i = 0; i < falseOutCount; i++) {
        $('.magazine .bullet').eq(bullet_true + i).addClass('out');
    }
}

function get_bullet_count() {
    return [bullet_true, bullet_false];
}

function set_bullet_count(index) {
    if ((bullet_true != 0 && bullet_false != 0) || $(this).hasClass('true')) {
        return;
    }
    if (bullet_true == 0) {
        bullet_true = index;
        for (var i = 0; i < bullet_true; i++) {
            $('.bullet').eq(i).addClass('true');
        }
        $('.count').text(bullet_true);
    } else {


        bullet_false = index - bullet_true;

        if(bullet_true + bullet_false > 8) {
            bullet_false = 0;
            return;
        }

        for (var i = bullet_true; i < bullet_true + bullet_false; i++) {
            $('.bullet').eq(i).addClass('false');
        }
        for (var i = 0; i < bullet_true + bullet_false; i++) {
            $('.prediction_magazine').append(`<div class="prediction_bullet">${i + 1}</div>`);
            prediction_bullet_status.push({type: null, status: false});
        }
        set();
        $('.count').text(bullet_true + bullet_false);
    }
}