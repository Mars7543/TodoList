/*-------------------*/
/*------Colors-------*/
/*-------------------*/
/*--Red-----#d50000--*/
/*--Orange--#ff9100--*/
/*--Yellow--#fdd835--*/
/*--Green---#00e676--*/
/*--Blue----#1565c0--*/
/*--Purple--#6a1b9a--*/
/*--Pink----#ff4081--*/
/*-------------------*/

function save() {
    localStorage.setItem("categories", JSON.stringify(categories));
}

function showForms() {
    $("#cat, #newtodo").css("display", "block");
    $("#cat, #newtodo").animate({
        height: noteheight,
        lineHeight: noteheight
    }, 500);
}

function hideForms() {
    $("#cat, #newtodo").animate({
        height: 0,
        lineHeight: 0
    }, 500, function() {
        $("#cat, #newtodo").css("display", "none");
    });
}

function hideEditTodo() {
    $("#edittodo").animate({
        height: 0,
        lineHeight: 0
    }, 500, function() {
        $("#edittodo").css("display", "none");
    });
}

function hideEditCat() {
    $("#edcat").animate({
        height: 0,
        lineHeight: 0
    }, 500, function() {
        $("#edcat").css("display", "none");
    });
}

function editTodo() {
    if ($("#edittodo").css("display") === "none") {
        editingTodoCat = categories[categoryTodoNum];
        editingTodo = editingTodoCat.todos[todoNum];
        $("#" + categories[categoryTodoNum].name.replace(/\s/g, '')).attr("selected", "selected");
        $("#edittodoname").val(editingTodo.name);
        $(".ed.month").val(editingTodo.month);
        $(".ed.day").val(editingTodo.day);
        $("#edittodo").css("display", "block");
        $("#edittodo").animate({
            height: parseInt(noteheight)*2.8,
            lineHeight: noteheight
        }, 500);
    } else {
        hideEditTodo();
    }
}

function confirmTodo() {
    var newTodo = {
        name: $("#edittodoname").val(),
        month: $(".ed.month").val(),
        day: $(".ed.day").val(),
        done: editingTodo.done
    }
    if ($("#catsel2").val() == editingTodoCat.name) {
        editingTodoCat.todos.splice(todoNum, 1, newTodo);
    } else {
        editingTodoCat.todos.splice(todoNum, 1);
        var category;
        for (var i=0; i<categories.length; i++) {
            if (categories[i].name == $("#catsel2").val())
                category = i;
        }
        addTodo(category, newTodo);
    }
    editTodo();
    updateContent();
}

function editCategory() {
    if ($("#edcat").css("display") === "none") {
        editingCategory = categories[categoryNum];
        $("#edcatname").val(editingCategory.name);
        $("#edcat").css("display", "block");
        $("#edcat").animate({
            height: parseInt(noteheight)*2.8,
            lineHeight: noteheight
        }, 500);
    } else {
        hideEditCat();
    }
}

function confirmCat() {
    editingCategory.name = $("#edcatname").val();
    editCategory();
    updateContent();
}

function updateColors() {
    var counter = 1;
    var color;
    for (var category=0; category<categories.length; category++) {
        color = (counter++ % 2 === 0 ? "#f7f7f7": "white");
        $("#c" + category).css("background-color", color);
        for (var todo=0; todo<categories[category].todos.length; todo++) {
            color = (counter % 2 === 0 ? "#f7f7f7": "white");
            if (!categories[category].collapsed)
                counter++;
            $("#c" + category + "t" + todo).css('background-color', color);
        }
    }
}

function updateContent() {
    var content="";
    for (var category=0; category<categories.length; category++) {
        var collapsed = categories[category].collapsed;
        if (categories[category].name != "No Category") {
            content +=
                `<div class='category' id=c` + category + `>
                    <div title='Delete Category' class='delete delete-category sidebutton'><i class='fa fa-trash' aria-hidden='true'></i></div>
                    <div title='View/Edit Info' class='edit edit-category sidebutton'><i class='fa fa-pencil' aria-hidden='true'></i></div>
                    <div title='Toggle Collapse' class='collapsable sidebutton'><i class='fa fa-arrow-` + (categories[category].collapsed ? "down": "up") + ` aria-hidden='true'></i></div>
                    <div class=categoryname>` + categories[category].name + `</div>
                    <div class=numtodos>` + categories[category].todos.length + ` Todo` + (categories[category].todos.length == 1 ? "": "s") + `</div>
                </div>`;
        }
        for (var todo=0; todo<categories[category].todos.length; todo++) {
            var todoDone = (categories[category].todos[todo].done ? " completed": "");
            var todoName = categories[category].todos[todo].name;
            todoName = (todoName.length > 40 ? todoName.slice(0, 37) + "...": todoName);
            content +=
                `<div class='todo` + todoDone + `' id=c` + category + `t` + todo + (collapsed ? " style='display: none;'": "") + `>
                    <div title='Delete Todo' class='delete sidebutton'><i class='fa fa-trash' aria-hidden='true'></i></span></div>
                    <div title='View/Edit Info' class='edit sidebutton'><i class='fa fa-pencil' aria-hidden='true'></i></div>
                    <div title='Toggle Complete' class='done sidebutton'><i class='fa fa-check' aria-hidden='true'></i></div>
                    <div class=todoname>` + todoName + `</div>
                    <div class=tododate>` + categories[category].todos[todo].month + ` / ` + categories[category].todos[todo].day + `</div></div>`;
        }
    }
    $("#todos").html(content);
    updateColors();

    save();
    [1, 2].forEach(function(num) {
        var options = "";
        categories.forEach(function(category) {
            options += "<option " + (num==2 ? ("id='" + category.name.replace(/\s/g, '') + "'"): "") + " value='" + category.name + "'>" + category.name + "</option>";
        });
        $("#catsel" + num).html(options);
    });

    /* THIS LINE WAS ADDED BY ALEX */
    loadedColors = localStorage.getItem("BGColor");
    if (loadedColors == null || loadedColors.indexOf(",") == -1)
        loadedColors = ["#00e676", "#ffffff"];
    else
        loadedColors = loadedColors.split(",");
    backgroundConfig(loadedColors[0], loadedColors[1]);
    /* END LINE ADDED BY ALEX */

    updateFunctions();
}

$("#newnote").click(function() {
    if ($("#newtodo").css("display") == "none") {
        hideEditCat();
        hideEditTodo();
        showForms();
    } else
        hideForms();
});

$("#datepicker1").datepicker({
        onSelect: function(selectedDate) {
            selectedDate = selectedDate.split("/");
            var month = parseInt(selectedDate[0]).toString();
            var day = parseInt(selectedDate[1]).toString();
            $(".new.month").val(month);
            $(".new.day").val(day);
            $(".new.day").focus();
        }
    });

$("#datepicker2").datepicker({
        onSelect: function(selectedDate) {
            selectedDate = selectedDate.split("/");
            var month = parseInt(selectedDate[0]).toString();
            var day = parseInt(selectedDate[1]).toString();
            $(".ed.month").val(month);
            $(".ed.day").val(day);
            $(".ed.day").focus();
        }
    });

$(".cal").click(function() {
    $($(this).parent().find(".datepicker")).datepicker("show");
});

$("#cancel").click(function() {
    editTodo();
});

$("#apply").click(function() {
    confirmTodo();
});

$("#cancel2").click(function() {
    editCategory();
});

$("#apply2").click(function() {
    confirmCat();
});

$("#newcategoryname").keypress(function(event) {
    var category = $("#newcategoryname").val();
    if (event.which == 13) {
        if (category === "") {
            $("#error-message").text("Error!  Please enter a category or a todo or hit apply in the editor.");
            $("#error").slideToggle(400).delay(2500).fadeOut();
        } else {
            event.preventDefault();
            categories.push({
                name: $("#newcategoryname").val(),
                todos: [],
                collapsed: false
            });
            $("#newcategoryname").val("");
            updateContent();
        }
    }
});


$("#newtodoname, .date").keypress(function(event) {
    if (event.which == 13) {
        var todo = $("#newtodoname").val();
        if (todo === "") {
            $("#error-message").text("Error!  Please enter a category or a todo or hit apply in the editor.");
            $("#error").slideToggle(400).delay(2500).fadeOut();
        } else {
            event.preventDefault();
            updateTodo(todo);
            $("#newtodoname").val("");
            $(".date").val("");
        }
    }
});

function addTodo(category, newTodo) {
    categories[category].todos.push(newTodo);
}

function updateTodo(todoName) {
    var category;
    for (var i=0; i<categories.length; i++) {
        if (categories[i].name == $("#catsel1").val())
            category = i;
    }
    addTodo(category, {
        name: todoName,
        month: $(".new.month").val(),
        day: $(".day").val(),
        done: false
    });
    updateContent();
}

function updateFunctions() {
    $(".category").hover(function() {
        $($(this).find(".sidebutton")).css("width", noteheight);
    }, function() {
        $($(this).find(".sidebutton")).css("width", 0);
    });

    $(".todo").hover(function() {
            $($(this).find(".sidebutton")).css("width", noteheight);
        }, function() {
            $($(this).find(".sidebutton")).css("width", 0);
        }
    );

    $(".delete").click(function() {
        if ($(this).hasClass("delete-category")) {
            var category = $(this).parent().attr("id").slice(1);
            $("#c" + category).fadeOut(function () {
                categories.splice(category, 1);
                updateContent();
            });
        } else {
            var id = $(this).parent().attr("id");
            var sep = id.indexOf("t");
            var category = id.slice(1, sep);
            var todo = id.slice(sep+1);
            $("#c" + category + "t" + todo).fadeOut(function () {
                categories[category].todos.splice(todo, 1);
                updateContent();
            });
        }
    });

    $(".edit").click(function() {
        if ($(this).hasClass("edit-category")) {
            $("#edittodo").css("display") != "none";
            categoryNum = $(this).parent().attr("id").slice(1);
            hideForms();
            hideEditTodo();
            editCategory();
        } else {
            var id = $(this).parent().attr("id");
            var sep = id.indexOf("t");
            categoryTodoNum = id.slice(1, sep);
            todoNum = id.slice(sep+1);
            hideForms();
            hideEditCat();
            editTodo(categoryTodoNum, todoNum);
        }
    });

    $(".done").click(function() {
        var id = $(this).parent().attr("id");
        var sep = id.indexOf("t");
        var category = id.slice(1, sep);
        var todo = id.slice(sep+1);
        categories[category].todos[todo].done = !categories[category].todos[todo].done;
        $(this).parent().toggleClass("completed");
        save();
    });

    $(".collapsable").click(function() {
        var cat = $(this).parent().attr("id").slice(1);
        categories[cat].collapsed = !categories[cat].collapsed;
        if ($(this).parent().hasClass("collapsed"))
            $(this).parent().removeClass("collapsed");
        else {
            $(this).parent().addClass("collapsed");
        }
        for (var i=0; i<categories[cat].todos.length; i++) {
            $("#c" + cat + "t" + i).slideToggle();
        }
        if ($(this).find(".fa").hasClass("fa-arrow-up")) {
            $(this).find(".fa").removeClass("fa-arrow-up");
            $(this).find(".fa").addClass("fa-arrow-down");
        } else {
            $(this).find(".fa").removeClass("fa-arrow-down");
            $(this).find(".fa").addClass("fa-arrow-up");
        }
        updateColors();
        save();
    });
}

var categories = localStorage.getItem("categories");
if (categories == null)
    categories = [{
        name: "No Category",
        todos: [],
        collapsed: false
    }];
else
    categories = JSON.parse(categories.toString());

var noteheight = $("#header").css("height");
$("#logo").css("height", noteheight);
$("#logo").css("line-height", noteheight);

/* ALL OF ALEX'S NEW CODE STARTS HERE */
var modal = document.getElementById('myModal');
var btn = document.getElementById("settingsbutton");
var span = document.getElementsByClassName("close")[0];

$("#settingsbutton").on("click", function () {
    $("#myModal").css("display", "inline-block");
    $("#leftColorInput").val(loadedColors[0]);
        $("#rightColorInput").val(loadedColors[1]);
});

$("#changecolors").change(function() {
    var chosen = $("#changecolors option:selected").val();
    if (chosen != "Custom") {
        $("#leftColorInput").val(chosen);
        $("#rightColorInput").val("#ffffff");
    }
});

$(".colorInput").click(function() {
    $("#Custom").attr("selected", "selected");
});

$(".close").on("click", function() {
    $("#Custom").attr("selected", "selected");
    $("#myModal").css("display", "none");
});

$("#swap").click(function() {
    var color1 = $("#leftColorInput").val();
    var color2 = $("#rightColorInput").val();
    $("#leftColorInput").val(color2);
    $("#rightColorInput").val(color1);
});

$("#same").click(function() {
    $("#rightColorInput").val($("#leftColorInput").val());
});

$(window).on("click", function(event) {
    if (event.target == modal) {
        $("#myModal").css("display", "none");
    }
});

$("#applycolorchange").on("click", function () {
    color1 = $("#leftColorInput").val();
    color2 = $("#rightColorInput").val();
    backgroundConfig(color1, color2);
    modal.style.display = "none";
    $("#Custom").attr("selected", "selected");
    updateContent();
});

function backgroundConfig (hex, color2) {
    $("body").css({
        background: "#000000",
        background: "-webkit-linear-gradient(to right, " + hex + ", " + color2 + ")",
        background: "linear-gradient(to right, " + hex + ", " + color2 + ")"
    });
    $("#header").css("background", hex);
    localStorage.setItem("BGColor", [hex, color2]);
}

var color;
/* ALL OF ALEX'S NEW CODE ENDS HERE */

var todoNum;
var categoryTodoNum;
var editingTodo;
var editingTodoCat;

var categoryNum;
var editingCategory;

var loadedColors;

for (var i=0; i<categories.length; i++) {
    if (categories[i].collapsed == null)
        categories[i].collapsed = false;
}
updateContent();
