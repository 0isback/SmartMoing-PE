/**
 * GuiPE 객체입니다
 * @author 0isback (kimsg0220@naver.com)
 * @since 2016.7.5
 * @namespace
 */
var GuiPE = {};

/**
 * 메인엑티비티의 Context 를 가져옵니다
 * @memberOf GuiPE
 */
GuiPE.getContext = function () {
    return com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
};

/**
 * @type {Number}
 * @memberOf GuiPE
 */
GuiPE.DIP = android.util.TypedValue.COMPLEX_UNIT_DIP;

/**
 * @type {android.util.DisplayMetrics}
 * @memberOf GuiPE
 */
GuiPE.METRICS = GuiPE.getContext().getResources().getDisplayMetrics();

/**
 * @type {Number}
 * @memberOf GuiPE
 */
GuiPE.WIDTH = GuiPE.getContext().getScreenWidth();

/**
 * @type {Number}
 * @memberOf GuiPE
 */
GuiPE.HEIGHT = GuiPE.getContext().getScreenHeight();

/**
 * 커스텀 DP 값을 가져옵니다
 * @memberOf GuiPE
 */
GuiPE.DP = function (dip, dips) {
    var dp = android.util.TypedValue.applyDimension(
        GuiPE.DIP, dip, GuiPE.METRICS);
        
    if (dips != null) {
        return dp * dips;
    } else {
        return dp;
    }
};

/**
 * UI 쓰레드 내에 함수를 실행합니다
 * @memberOf GuiPE
 */
GuiPE.uiThread = function (func) {
    GuiPE.getContext().runOnUiThread ( new java.lang.Runnable ( {
        run : func
    }));
};

/**
 * 오류내용을 보여줍니다
 * @memberOf GuiPE
 */
GuiPE.Debug = function (e) {
    GuiPE.uiThread ( function () {
        try {
            var dialog = new android.app.AlertDialog.Builder(GuiPE.getContext());
            var str = "Error!\n - " + e.name + "\n - #" + (e.lineNumber + 1) + "\n\n" + e.message;
            dialog.setTitle("Error!");
            dialog.setMessage(str);
            dialog.show();
        } catch (e) {
            print(e);
        }
    });
};

/**
 * 마인크래프트 내장 이미지를 얻어옵니다
 * @memberOf GuiPE
 */
GuiPE.getImage = function (path) {
    return android.graphics.BitmapFactory.decodeStream(
        ModPE.openInputStreamFromTexturePack(path));
};

/**
 * 마인크래프트 아이템 이미지를 얻어옵니다
 * @memberOf GuiPE
 */
GuiPE.getItemImage = function () {
    //개발예정..
};

/**
 * Widget 객체입니다
 * @author 0isback (kimsg0220@naver.com)
 * @since 2016.9.28
 * @namespace Widget
 * @memberOf GuiPE
 */
GuiPE.Widget = {};

/**
 * 마인크래프트 형식의 텍스트뷰를 생성합니다.
 * @class
 * @memberOf GuiPE.Widget
 */
GuiPE.Widget.TextView = function () {
    this.main = new android.widget.ImageView(GuiPE.getContext());
    this.window = new android.widget.PopupWindow(GuiPE.getContext());
    this.width = null;
    this.height = null;
    
    this.text = "";
    this.color = "#e1e1e1";
    this.gravity = android.view.Gravity.CENTER;
    this.bitmap = null;
};

/**
 * 텍스트뷰 프로토타입 객체입니다
 * @author 0isback (kimsg0220@naver.com)
 * @since 2016.9.29
 */
GuiPE.Widget.TextView.prototype = {
    constructor: GuiPE.Widget.TextView,

    /**
     * 텍스트를 설정합니다
     */
    setText : function (text) {
        this.text = text;
        return this;
    },
    
    /**
     * 텍스트의 위치를 설정합니다
     */
    setGravity : function (gravity) {
        this.gravity = gravity;
        return this;
    },
    
    /**
     * 텍스트의 색상을 설정합니다
     */
    setColor : function (color) {
        this.color = color;
        return this;
    },
    
    /**
     * 텍스트뷰를 렌더링합니다
     */
    render : function () {
        var that = this;
        that.window.setBackgroundDrawable(null);
        
        that.bitmap = FontPE.createFontImage(that.gravity, that.text, that.color, false);
        that.width = that.bitmap.Width * GuiPE.DP(2);
        that.height = that.bitmap.Height * GuiPE.DP(2);
        
        that.main.setImageBitmap(that.bitmap.Image);
        
        return this;
    }
};

/**
 * 마인크래프트 형식의 버튼을 생성합니다.
 * @class
 * @memberOf GuiPE.Widget
 */
GuiPE.Widget.Button = function () {
    this.main = new android.widget.ImageView(GuiPE.getContext());
    this.window = new android.widget.PopupWindow(GuiPE.getContext());
    this.width = null;
    this.height = null;
    
    this.text = "";
    this.color = ["#e1e1e1", "#ffffa1"];
    this.gravity = android.view.Gravity.CENTER;
    this.background = true;
    this.bitmap = null;
    this.bitmap_pushed = null;
    this.listener = function () {
        
    };
};

/**
 * 버튼 프로토타입 객체입니다
 * @author 0isback (kimsg0220@naver.com)
 * @since 2016.9.29
 */
GuiPE.Widget.Button.prototype = {
    constructor: GuiPE.Widget.Button,

    /**
     * 텍스트를 설정합니다
     */
    setText : function (text) {
        this.text = text;
        return this;
    },
    
    /**
     * 텍스트의 위치를 설정합니다
     */
    setGravity : function (gravity) {
        this.gravity = gravity;
        return this;
    },
    
    /**
     * 텍스트의 색상을 설정합니다
     */
    setColor : function (color) {
        this.color = color;
        return this;
    },
    
    /**
     * 버튼의 온클릭리스너를 설정합니다
     */
    setOnClickListener : function (listener) {
        this.listener = listener;
        return this;
    },
    
    /**
     * 버튼의 백그라운드 여부를 설정합니다
     */
    setBackground : function (bool) {
        this.background = bool;
        return this;
    },
    
    /**
     * 버튼을 렌더링합니다
     */
    render : function () {
        var that = this;
        that.window.setBackgroundDrawable(null);
    
        that.bitmap = FontPE.createFontImage(that.gravity, that.text, that.color[0], false);
        that.bitmap_pushed = FontPE.createFontImage(that.gravity, that.text, that.color[1], true);
        that.width = that.bitmap.Width * GuiPE.DP(2);
        that.height = that.bitmap.Height * GuiPE.DP(2);
        
        var none = [that.bitmap.Image, GuiPE.Bitmap.NORMAL()];
        var push = [that.bitmap_pushed.Image, GuiPE.Bitmap.PUSH()];
        
        that.main.setImageBitmap(none[0]);
        that.main.setBackgroundDrawable(
            (that.background == true) ? none[1] : null);
        that.main.setOnTouchListener ( new android.view.View.OnTouchListener ( {
            onTouch : function (view, event) {
                const ACTION = event.getAction();
                const MOTION = android.view.MotionEvent;
                if (ACTION == MOTION.ACTION_DOWN) {
                    that.main.setImageBitmap(push[0]);
                    that.main.setBackgroundDrawable(
                        (that.background == true) ? push[1] : null);
                } else if (ACTION == MOTION.ACTION_UP) {
                    that.main.setImageBitmap(none[0]);
                    that.main.setBackgroundDrawable(
                        (that.background == true) ? none[1] : null);
                }
                return false;
            }
        }));
        that.main.setOnClickListener ( new android.view.View.OnClickListener ( {
            onClick : this.listener
        }));
        
        return this;
    }
};

/**
 * 마인크래프트 형식의 GUI 버튼을 생성합니다
 * @class
 * @memberOf GuiPE.Widget
 */
GuiPE.Widget.GUIButton = function () {
    this.main = new android.widget.ImageView(GuiPE.getContext());
    this.bitmap = null;
};

/**
 * GUI 버튼 프로토타입 객체입니다
 * @author 0isback (kimsg0220@naver.com)
 * @since 2016.10.17
 */
GuiPE.Widget.GUIButton.prototype = {
    constructor: GuiPE.Widget.GUIButton,

    /**
     * 비트맵을 설정합니다
     */
    setBitmap : function (bitmap) {
        this.bitmap = bitmap;
        return this;
    },
    
    /**
     * GUI 버튼을 렌더링합니다
     */
    render : function () {
        var that = this;
        
        that.main.setAlpha(0.5);
        that.main.setClickable(true);
        that.main.setBackgroundDrawable(that.bitmap);
        that.main.setOnTouchListener ( new android.view.View.OnTouchListener ( {
            onTouch : function (view, event) {
                const ACTION = event.getAction();
                const MOTION = android.view.MotionEvent;
    
                if (ACTION == MOTION.ACTION_DOWN) {
                    that.main.setImageBitmap(GuiPE.Bitmap.LAYER());
                } else if (ACTION == MOTION.ACTION_UP) {
                    that.main.setImageBitmap(null);
                }
                return false;
            }
        }));
        
        return this;
    }
};

/**
 * 마인크래프트 형식의 토스트를 생성합니다
 * @class
 * @memberOf GuiPE.Widget
 */
GuiPE.Widget.Toast = function () {
    this.main = new android.widget.Toast(GuiPE.getContext());
    this.textview = null;
    this.textLayout = new android.widget.LinearLayout(GuiPE.getContext());
    this.backLayout = new android.widget.LinearLayout(GuiPE.getContext());
};

/**
 * 토스트 프로토타입 객체입니다
 * @author 0isback (kimsg0220@naver.com)
 * @since 2016.10.1
 */
GuiPE.Widget.Toast.prototype = {
    constructor: GuiPE.Widget.Toast,

    /**
     * 텍스트를 설정합니다
     */
    setText : function (text) {
        this.textview = new GuiPE.Widget.TextView()
            .setText(text)
            .render();
        
        return this;
    },
    
    /**
     * 토스트를 렌더링합니다
     */
    render : function () {
        var that = this;
        
        that.textLayout.setGravity(
            android.view.Gravity.CENTER | android.view.Gravity.CENTER);
        that.textLayout.setPadding(GuiPE.DP(1, 20), GuiPE.DP(1, 8), 
            GuiPE.DP(1, 20), GuiPE.DP(1, 8));
        that.textLayout.addView(GuiPE.View.getView(that.textview));
        
        that.backLayout.setGravity(
            android.view.Gravity.CENTER | android.view.Gravity.CENTER);
        that.backLayout.addView(that.textLayout);
        that.backLayout.setBackgroundDrawable(GuiPE.Bitmap.PANEL());
        
        return this;
    },
    
    /**
     * 토스트를 화면에 띄웁니다
     */
    show : function () {
        var that = this;
        
        GuiPE.uiThread ( function () {
            that.main.setView(that.backLayout);
            that.main.show();
        });
        
        return this;
    }
};

/**
 * 마인크래프트 형식의 스위치를 생성합니다.
 * @class
 * @memberOf GuiPE.Widget
 */
GuiPE.Widget.Switch = function () {
    this.main = new android.widget.ToggleButton(GuiPE.getContext());
    this.window = new android.widget.PopupWindow(GuiPE.getContext());
    this.width = GuiPE.DP(2, 38);
    this.height = GuiPE.DP(2, 19);
    
    this.isOn = false;
    this.listener = function () {
        
    };
};

/**
 * 스위치 프로토타입 객체입니다
 * @author 0isback (kimsg0220@naver.com)
 * @since 2016.10.1
 */
GuiPE.Widget.Switch.prototype = {
    constructor: GuiPE.Widget.Switch,

    /**
     * 스위치의 초기 꺼짐 켜짐을 조절합니다
     */
    setChecked : function (bool) {
        this.isOn = bool;
        return this;
    },
    
    /**
     * 스위치의 리스너를 선언합니다
     */
    setOnClickListener : function (listener) {
        this.listener = listener;
        return this;
    },
    
    /**
     * 스위치를 렌더링합니다
     */
    render : function () {
        var that = this;
        that.window.setBackgroundDrawable(null);
        
        that.main.setText("");
        that.main.setTextOn("");
        that.main.setTextOff("");
        that.main.setChecked(this.isOn);
        that.main.setBackgroundDrawable(android.graphics.drawable.BitmapDrawable(
            that.isOn ? GuiPE.Bitmap.SWITCH_ON() : GuiPE.Bitmap.SWITCH_OFF()));
        that.main.setOnTouchListener ( new android.view.View.OnTouchListener ( {
            onTouch : function (view, event) {
                const ACTION = event.getAction();
                const MOTION = android.view.MotionEvent;
                if (ACTION == MOTION.ACTION_DOWN) {
                    var checked = !that.main.isChecked();
                    that.main.setChecked(checked);
                    that.main.setBackgroundDrawable(android.graphics.drawable.BitmapDrawable(
                        checked ? GuiPE.Bitmap.SWITCH_ON() : GuiPE.Bitmap.SWITCH_OFF()));
                    that.listener(checked);
                }
                return true;
            }
        }));
        
        return this;
    }
};

/**
 * 마인크래프트 형식의 시크바를 생성합니다.
 * @class
 * @memberOf GuiPE.Widget
 */
GuiPE.Widget.SeekBar = function () {
    this.main = new android.widget.SeekBar(GuiPE.getContext());
    this.window = new android.widget.PopupWindow(GuiPE.getContext());
    this.width = GuiPE.DP(2, this.seekbarwidth);
    this.height = GuiPE.DP(2, 17);
    
    this.seekbarwidth = 100;
    this.max = null;
    this.progress = null;
    this.listener = function () {
        
    };
};

/**
 * 시크바 프로토타입 객체입니다
 * @author 0isback (kimsg0220@naver.com)
 * @since 2016.10.2
 */
GuiPE.Widget.SeekBar.prototype = {
    constructor: GuiPE.Widget.SeekBar,

    /**
     * max 값을 설정합니다
     */
    setMax : function (max) {
        this.max = max;
        return this;
    },
    
    /**
     * progress 값을 설정합니다
     */
    setProgress : function (progress) {
        this.progress = progress;
        return this;
    },
    
    /*
     * 시크바의 시각적 길이를 설정합니다
     */
    setWidth : function (width) {
        this.seekbarwidth = width;
        return this;
    },
    
    /*
     * 시크바의 리스너를 설정합니다
     */
    setOnSeekBarChangeListener : function (listener) {
        this.listener = listener;
        return this;
    },
    
    /*
     * 시크바를 렌더링합니다
     */
    render : function () {
        var that = this;
        that.window.setBackgroundDrawable(null);
        that.width = GuiPE.DP(2, that.seekbarwidth);
        
        const bitmap = android.graphics.Bitmap.createBitmap(
            that.width, that.height, android.graphics.Bitmap.Config.ARGB_8888);
        const canvas = new android.graphics.Canvas(bitmap);
        const paint = new android.graphics.Paint();
        paint.setColor(android.graphics.Color.parseColor("#717171"));
        canvas.drawRect(GuiPE.DP(2, 7), GuiPE.DP(2, 7), 
            that.width - GuiPE.DP(2, 7), GuiPE.DP(2, 10), paint);
        
        //make dot
        if (that.max < 6) {
            const dotPaint = new android.graphics.Paint();
            dotPaint.setColor(android.graphics.Color.parseColor("#929292"));
            var x;
            for (var i = 0; i <= that.max; i ++) {
                x = GuiPE.DP(2, 7) + i * (that.width - GuiPE.DP(2, 18)) / that.max;
                canvas.drawRect(x, GuiPE.DP(2, 5), x + GuiPE.DP(2, 4), GuiPE.DP(2, 12), dotPaint);
            }
            
            that.main.setMax(that.seekbarwidth);
            that.main.setProgress(that.seekbarwidth / that.max * that.progress);
            that.main.setOnSeekBarChangeListener ( new android.widget.SeekBar.OnSeekBarChangeListener ( {
                onStopTrackingTouch : function (view) {
                    const value = that.main.getProgress();
                    const gap = that.seekbarwidth / that.max;
                    var progress = 0;
                    for (var i = 0; i <= that.max; i ++) {
                        if (value < gap * (i + 0.5)) {
                            progress = i;
                            break;
                        }
                    }
                    that.main.setProgress(that.seekbarwidth / that.max * progress);
                    that.listener(progress);
                }
            }));
        } else {
            that.main.setMax(that.max);
            that.main.setProgress(that.progress);
            that.main.setOnSeekBarChangeListener ( new android.widget.SeekBar.OnSeekBarChangeListener ( {
                onStopTrackingTouch : function (view) {
                    var value = that.main.getProgress();
                    that.listener(value);
                }
            }));
        }
        that.main.setThumb(android.graphics.drawable.BitmapDrawable(GuiPE.Bitmap.SEEKBAR_THUMB()));
        that.main.setProgressDrawable(
            new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
        that.main.setBackgroundDrawable(android.graphics.drawable.BitmapDrawable(bitmap));
        
        return this;
    }
};

/**
 * 마인크래프트 형식의 탑바를 생성합니다.
 * @class
 * @memberOf GuiPE.Widget
 */
GuiPE.Widget.TopBar = function () {
    this.main = new android.widget.FrameLayout(GuiPE.getContext());
    this.window = new android.widget.PopupWindow(GuiPE.getContext());
    this.width = GuiPE.WIDTH;
    this.height = GuiPE.DP(1, 60);
    
    this.text = null;
    this.textwidth = null;
    this.textheight = null;
};

/**
 * 탑바 프로토타입 객체입니다
 * @author 0isback (kimsg0220@naver.com)
 * @since 2016.10.5
 */
GuiPE.Widget.TopBar.prototype = {
    constructor: GuiPE.Widget.TopBar,

    /**
     * 텍스트를 설정합니다
     */
    setText : function (text) {
        this.text = new GuiPE.Widget.TextView()
            .setText(text)
            .render();
        
        return this;
    },
    
    /**
     * 탑바의 너비를 설정합니다
     */
    setWidth : function (width) {
        this.width = width;
        return this;
    }, 
    
    /**
     * 탑바를 렌더링합니다
     */
    render : function () {
        var that = this;
        that.window.setBackgroundDrawable(null);
        
        that.textwidth = GuiPE.View.getWidth(that.text);
        that.textheight = GuiPE.View.getHeight(that.text);
        
        var VIEW = new android.widget.LinearLayout(GuiPE.getContext());
        VIEW.addView(GuiPE.View.getView(that.text), that.textwidth, that.textheight);
        VIEW.setGravity(android.view.Gravity.CENTER | android.view.Gravity.CENTER);
        
        that.main.addView(VIEW, that.width, GuiPE.DP(1, 55));
        that.main.setBackgroundDrawable(GuiPE.Bitmap.TOPBAR());
        
        return this;
    }
};

/**
 * 마인크래프트 형식의 이미지 토글을 생성합니다
 * @class
 * @memberOf GuiPE.Widget
 */
GuiPE.Widget.ImageToggle = function () {
    var bt = new android.widget.ImageView(GuiPE.getContext());

    bt.setClickable(true);
    bt.setBackgroundDrawable(GuiPE.Bitmap.NORMAL());

    return bt;
};

/**
 * 마인크래프트 형식의 옵션창을 생성합니다
 * @class
 * @memberOf GuiPE.Widget
 */
GuiPE.Widget.Option = function () {
    this.main = new android.widget.FrameLayout(GuiPE.getContext());
    this.window = new android.widget.PopupWindow(GuiPE.getContext());
    this.width = GuiPE.WIDTH;
    this.height = GuiPE.HEIGHT;
    
    this.index = -1;
    this.index2 = -1;
    
    this.layout_title = new GuiPE.Widget.TopBar();
    this.layout_close = new android.widget.LinearLayout(GuiPE.getContext());
    this.layout_left = new android.widget.LinearLayout(GuiPE.getContext());
    this.closeButton = new GuiPE.Widget.Button();
    
    this.layout_list = new Array();
    this.layout_scr = new Array();
    this.tv_head = new Array();
    this.slot = new Array();
    this.m_slot_margin = new Array();
};

/**
 * 옵션창 프로토타입 객체입니다
 * @author 0isback (kimsg0220@naver.com)
 * @since 2016.10.6
 */
GuiPE.Widget.Option.prototype = {
    constructor: GuiPE.Widget.Option,

    /**
     * 타이틀을 설정합니다
     */
    setTitle : function (text) {
        var that = this;
        
        that.layout_title
            .setText(text)
            .render();
        
        return this;
    },
    
    /**
     * 닫힘 버튼의 텍스트를 설정합니다
     */
    setCloseText : function (text) {
        var that = this;
        
        that.closeButton
            .setText(text)
            .setOnClickListener(function (){
                GuiPE.View.close(that);
            })
            .render();
        
        return this;
    },
     
    /**
     * 슬롯을 추가합니다
     * @param {Bitmap} bit - 추가할 슬롯의 이미지
     */
    addSlot : function (bit) {
        var that = this;
        
        that.index++;
        var thisIndex = that.index;

        that.m_slot_margin[that.index] = new android.widget.LinearLayout(GuiPE.getContext());
        that.slot[that.index] = new GuiPE.Widget.ImageToggle();
        
        that.slot[that.index].setImageBitmap(bit);
        that.slot[that.index].setOnClickListener (new android.view.View.OnClickListener( {
            onClick : function (view) {
                for (var i in that.slot) {
                    that.slot[i].setBackgroundDrawable(GuiPE.Bitmap.NORMAL());
                    that.layout_list[i].setVisibility(android.view.View.GONE);
                    that.layout_scr[i].setVisibility(android.view.View.GONE);
                }
                view.setBackgroundDrawable(GuiPE.Bitmap.PUSH());
                that.layout_list[thisIndex].setVisibility(android.view.View.VISIBLE);
                that.layout_scr[thisIndex].setVisibility(android.view.View.VISIBLE);
            }
        }));
        
        that.layout_left.setGravity(android.view.Gravity.CENTER | android.view.Gravity.CENTER);
        that.layout_left.setOrientation(1);
        
        that.layout_list[that.index] = new android.widget.LinearLayout(GuiPE.getContext());
        that.layout_list[that.index].setOrientation(1);
        that.layout_list[that.index].setPadding(GuiPE.DP(1, 100), GuiPE.DP(1, 65), 0, 0);
        that.layout_list[that.index].setVisibility(android.view.View.GONE);

        that.layout_scr[that.index] = new android.widget.ScrollView(GuiPE.getContext());
        that.layout_scr[that.index].setVisibility(android.view.View.GONE);
        
        if (that.index == 0) {
            that.slot[that.index].setBackgroundDrawable(GuiPE.Bitmap.PUSH());
            that.layout_list[that.index].setVisibility(android.view.View.VISIBLE);
            that.layout_scr[that.index].setVisibility(android.view.View.VISIBLE);
        }

        that.m_slot_margin[that.index].setGravity(android.view.Gravity.CENTER | android.view.Gravity.CENTER);
        that.m_slot_margin[that.index].addView(that.slot[that.index], GuiPE.DP(1, 55), GuiPE.DP(1, 55));
        that.layout_left.addView(that.m_slot_margin[that.index], GuiPE.DP(1, 55), GuiPE.DP(1, 57.5));
        that.layout_scr[that.index].addView(that.layout_list[that.index]);
        that.main.addView(that.layout_scr[that.index], GuiPE.WIDTH, GuiPE.HEIGHT);
        
        return this;
    },
    
    /**
     * 카테고리를 추가합니다
     * @param {String} text - 추가할 카테고리의 이름
     */
    addCategory : function (text) {
        var that = this;
        
        that.index2++;

        that.tv_head[that.index2] = new GuiPE.Widget.TextView()
            .setText(text)
            .setGravity(android.view.Gravity.LEFT)
            .render();
        const width = GuiPE.View.getWidth(that.tv_head[that.index2]);
        const height = GuiPE.View.getHeight(that.tv_head[that.index2]);
        that.layout_list[that.index].addView(
            GuiPE.View.getView(that.tv_head[that.index2]), width, height);
            
        return this;
    },
    
    /**
     * 스위치를 추가합니다
     * @param {String} text - 추가할 스위치의 이름
     * @param {Boolean} isOn - 스위치의 꺼짐/켜짐 여부
     * @param {Function} callback - 추가할 스위치의 기능
     */
    addSwitch : function (text, isOn, callback) {
        var that = this;
        var layout = new android.widget.LinearLayout(GuiPE.getContext());
        var layout_text = new createOptionTextLayout(text, "#FFB5B5B5");
        var layout_switch = new android.widget.LinearLayout(GuiPE.getContext());
        var _switch = new GuiPE.Widget.Switch()
            .setChecked(isOn)
            .setOnClickListener(callback)
            .render();
        
        var padding = new android.widget.TextView(GuiPE.getContext());
        
        layout.setPadding(GuiPE.DP(1, 15), GuiPE.DP(1, 2), GuiPE.DP(1, 2), GuiPE.DP(1, 2));
        layout.addView(layout_text.getView());
        layout.addView(padding, GuiPE.WIDTH - GuiPE.DP(1, 105)
            - GuiPE.DP(1, 110) - layout_text.getWidth(), GuiPE.DP(1, 40));
        //text & padding
        layout_switch.setPadding(GuiPE.DP(1, 2), GuiPE.DP(1, 2), GuiPE.DP(1, 2), GuiPE.DP(1, 2));
        layout_switch.addView(GuiPE.View.getView(_switch), GuiPE.DP(1, 70), GuiPE.DP(1, 35));
        //switch
        layout.addView(layout_switch, GuiPE.DP(1, 80), GuiPE.DP(1, 40));
        //add to layout
        that.layout_list[that.index].addView(layout, GuiPE.WIDTH
            - GuiPE.DP(1, 105) - GuiPE.DP(1, 15), GuiPE.DP(1, 44));
        //add to main
        
        return this;
    },
    
    /**
     * 버튼을 추가합니다
     * @param {String} text - 추가할 버튼의 이름
     * @param {String} btname - 버튼 위의 텍스트
     * @param {Function} callback - 추가할 버튼의 기능
     */
    addButton : function (text, btname, callback) {
        var that = this;
        var layout = new android.widget.LinearLayout(GuiPE.getContext());
        var layout_text = new createOptionTextLayout(text, "#FFB5B5B5");
        
        var layout_button = new android.widget.LinearLayout(GuiPE.getContext());
        var button = new GuiPE.Widget.Button()
            .setText(btname)
            .setOnClickListener(callback)
            .render();
        //button
        
        var padding = new android.widget.TextView(GuiPE.getContext());
        
        layout.setPadding(GuiPE.DP(1, 15), GuiPE.DP(1, 2), GuiPE.DP(1, 2), GuiPE.DP(1, 2));
        layout.addView(layout_text.getView());
        layout.addView(padding, GuiPE.WIDTH - GuiPE.DP(1, 105)
            - (GuiPE.View.getWidth(button) + GuiPE.DP(1, 40)) - layout_text.getWidth(), GuiPE.DP(1, 40));
        //text & padding
        layout_button.setPadding(GuiPE.DP(1, 2), GuiPE.DP(1, 2), GuiPE.DP(1, 2), GuiPE.DP(1, 2));
        layout_button.addView(GuiPE.View.getView(button), GuiPE.View.getWidth(button), GuiPE.DP(1, 35));
        //button
        layout.addView(layout_button, GuiPE.View.getWidth(button) + GuiPE.DP(1, 10), GuiPE.DP(1, 40));
        //add to layout
        that.layout_list[that.index].addView(layout, GuiPE.WIDTH
            - GuiPE.DP(1, 105) - GuiPE.DP(1, 15), GuiPE.DP(1, 44));
        //add to main
        
        return this;
    },
    
    /**
     * 시크바를 추가합니다
     * @param {String} text - 추가할 시크바의 이름
     * @param {Number} max - 시크바의 최댓값
     * @param {Number} progress - 초기 시크바의 위치
     * @param {Function} callback - 추가할 버튼의 기능
     */
    addSeekBar : function (text, max, progress, callback) {
        var that = this;
        var layout = new android.widget.LinearLayout(GuiPE.getContext());
        var layout_text = new createOptionTextLayout(text, "#FFB5B5B5");
        
        var layout_seek = new android.widget.LinearLayout(GuiPE.getContext());
        var seek = new GuiPE.Widget.SeekBar()
            .setMax(max)
            .setProgress(progress)
            .setOnSeekBarChangeListener(callback)
            .render();
        //seekbar
        
        var padding = new android.widget.TextView(GuiPE.getContext());
        
        layout.setPadding(GuiPE.DP(1, 15), GuiPE.DP(1, 2), GuiPE.DP(1, 2), GuiPE.DP(1, 2));
        layout.addView(layout_text.getView());
        layout.addView(padding, GuiPE.WIDTH - GuiPE.DP(1, 105) 
            - GuiPE.DP(1, 233) - layout_text.getWidth(), GuiPE.DP(1, 40));
        //text&padding
        layout_seek.setPadding(GuiPE.DP(1, 2), GuiPE.DP(1, 2), GuiPE.DP(1, 2), GuiPE.DP(1, 2));
        layout_seek.addView(GuiPE.View.getView(seek), GuiPE.DP(200), GuiPE.DP(1, 35));
        //seekbar
        layout.addView(layout_seek, GuiPE.DP(205), GuiPE.DP(1, 40));
        //add to layout
        that.layout_list[that.index].addView(layout, GuiPE.WIDTH
            - GuiPE.DP(1, 105) - GuiPE.DP(1, 15), GuiPE.DP(1, 44));
        //add to main
        
        return this;
    },
    
    /**
     * 옵션창을 렌더링합니다
     */
    render : function () {
        var that = this;
        
        that.layout_close.setPadding(GuiPE.DP(1, 8), GuiPE.DP(1, 8), GuiPE.DP(1, 5), GuiPE.DP(1, 5));
        that.layout_close.addView(GuiPE.View.getView(that.closeButton));
        GuiPE.View.getView(that.layout_title).addView(that.layout_close, GuiPE.DP(1, 96), GuiPE.DP(1, 48));
        
        that.layout_left.setPadding(0, GuiPE.DP(1, 70), 0, GuiPE.DP(1, 20));
        that.layout_left.setBackgroundDrawable(null);
        that.layout_left.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(
            android.graphics.Color.parseColor("#FF948781")));
        that.window.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(
            android.graphics.Color.parseColor("#80000000")));
        
        if (that.index < 5) {
            that.main.addView(that.layout_left, GuiPE.DP(1, 75), GuiPE.HEIGHT);
        } else {
            var layout_left_scr = new android.widget.ScrollView(GuiPE.getContext());
            layout_left_scr.addView(that.layout_left, GuiPE.DP(1, 75), GuiPE.HEIGHT);
            layout_left_scr.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(
                android.graphics.Color.parseColor("#FF948781")));
            that.layout_main.addView(layout_left_scr, GuiPE.DP(1, 75), GuiPE.HEIGHT);
        }
        that.main.addView(GuiPE.View.getView(that.layout_title), GuiPE.WIDTH, GuiPE.DP(1, 60));
        that.window.setFocusable(true);
        
        return this;
    }
};

/**
 * 옵션창의 텍스트 레이아웃을 생성합니다
 * @param {String} text - 텍스트
 */
function createOptionTextLayout(text, color) {
    this.layout_text = new android.widget.LinearLayout(GuiPE.getContext());
    this.text = new GuiPE.Widget.TextView()
        .setText(text)
        .setColor(color)
        .setGravity(android.view.Gravity.LEFT)
        .render();
    this.width = GuiPE.View.getWidth(this.text);
    this.height = GuiPE.View.getWidth(this.text);
    this.layout_text.addView(GuiPE.View.getView(this.text));
}

/**
 * 옵션텍스트 프로토타입 객체입니다
 *  @author 0isback (kimsg0220@naver.com)
 * @since 2016.10.8
 */
createOptionTextLayout.prototype = {
    constructor: createOptionTextLayout,

    getView : function () {
        return this.layout_text;
    },
    
    getWidth : function () {
        return this.width;
    },
    
    getHeight : function () {
        return this.height;
    }
};

/**
 * 마인크래프트 형식의 커스텀윈도우를 생성합니다
 * @class
 * @memberOf GuiPE.Widget
 */
GuiPE.Widget.CustomWindow = function () {
    this.main = new android.widget.LinearLayout(GuiPE.getContext());
    this.window = new android.widget.PopupWindow(GuiPE.getContext());
    this.width = GuiPE.WIDTH - GuiPE.DP(1, 50);
    this.height = GuiPE.HEIGHT - GuiPE.DP(1, 50);
    
    this.layout_main = new android.widget.LinearLayout(GuiPE.getContext());
    this.layout_content = new android.widget.LinearLayout(GuiPE.getContext());
    this.layout_scr = new android.widget.ScrollView(GuiPE.getContext());
    this.layout_title = new android.widget.LinearLayout(GuiPE.getContext());
    this.title = new GuiPE.Widget.TextView();
};

/**
 * 커스텀윈도우 프로토타입 객체입니다
 *  @author 0isback (kimsg0220@naver.com)
 * @since 2016.10.24
 */
GuiPE.Widget.CustomWindow.prototype = {
    constructor: GuiPE.Widget.CustomWindow,

    /**
     * 타이틀을 설정합니다
     */
    setTitle : function (text) {
        var that = this;
        that.title.setText(text).render();
        
        return this;
    },
    
    /**
     * 스위치를 추가합니다
     * @param {String} text - 추가할 스위치의 이름
     * @param {Boolean} isOn - 스위치의 꺼짐/켜짐 여부
     * @param {Function} callback - 추가할 스위치의 기능
     */
    addSwitch : function (text, isOn, callback) {
        var that = this;
        var layout = new android.widget.LinearLayout(GuiPE.getContext());
        var layout_text = new createOptionTextLayout(text, "#e1e1e1");
        var layout_switch = new android.widget.LinearLayout(GuiPE.getContext());
        var _switch = new GuiPE.Widget.Switch()
            .setChecked(isOn)
            .setOnClickListener(callback)
            .render();
        
        var padding = new android.widget.TextView(GuiPE.getContext());
        
        layout.setPadding(GuiPE.DP(1, 15), GuiPE.DP(1, 2), GuiPE.DP(1, 2), GuiPE.DP(1, 2));
        layout.addView(layout_text.getView());
        layout.addView(padding, GuiPE.WIDTH - GuiPE.DP(1, 105)
            - GuiPE.DP(1, 110) - layout_text.getWidth(), GuiPE.DP(1, 40));
        //text & padding
        layout_switch.setPadding(GuiPE.DP(1, 2), GuiPE.DP(1, 2), GuiPE.DP(1, 2), GuiPE.DP(1, 2));
        layout_switch.addView(GuiPE.View.getView(_switch), GuiPE.DP(1, 70), GuiPE.DP(1, 35));
        //switch
        layout.addView(layout_switch, GuiPE.DP(1, 80), GuiPE.DP(1, 40));
        //add to layout
        that.layout_content.addView(layout, GuiPE.WIDTH
            - GuiPE.DP(1, 105) - GuiPE.DP(1, 15), GuiPE.DP(1, 44));
        //add to main
        
        return this;
    },
    
    /**
     * 시크바를 추가합니다
     * @param {String} text - 추가할 시크바의 이름
     * @param {Number} max - 시크바의 최댓값
     * @param {Number} progress - 초기 시크바의 위치
     * @param {Function} callback - 추가할 버튼의 기능
     */
    addSeekBar : function (text, max, progress, callback) {
        var that = this;
        var layout = new android.widget.LinearLayout(GuiPE.getContext());
        var layout_text = new createOptionTextLayout(text, "#e1e1e1");
        
        var layout_seek = new android.widget.LinearLayout(GuiPE.getContext());
        var seek = new GuiPE.Widget.SeekBar()
            .setMax(max)
            .setProgress(progress)
            .setOnSeekBarChangeListener(callback)
            .render();
        //seekbar
        
        var padding = new android.widget.TextView(GuiPE.getContext());
        
        layout.setPadding(GuiPE.DP(1, 15), GuiPE.DP(1, 2), GuiPE.DP(1, 2), GuiPE.DP(1, 2));
        layout.addView(layout_text.getView());
        layout.addView(padding, GuiPE.WIDTH - GuiPE.DP(1, 105) 
            - GuiPE.DP(1, 233) - layout_text.getWidth(), GuiPE.DP(1, 40));
        //text&padding
        layout_seek.setPadding(GuiPE.DP(1, 2), GuiPE.DP(1, 2), GuiPE.DP(1, 2), GuiPE.DP(1, 2));
        layout_seek.addView(GuiPE.View.getView(seek), GuiPE.DP(200), GuiPE.DP(1, 35));
        //seekbar
        layout.addView(layout_seek, GuiPE.DP(205), GuiPE.DP(1, 40));
        //add to layout
        that.layout_content.addView(layout, GuiPE.WIDTH
            - GuiPE.DP(1, 105) - GuiPE.DP(1, 15), GuiPE.DP(1, 44));
        //add to main
        
        return this;
    },
    
    /**
     * 커스텀윈도우창을 렌더링합니다
     */
    render : function () {
        var that = this;
        
        that.layout_title.setGravity(android.view.Gravity.CENTER | android.view.Gravity.CENTER);
        that.layout_title.addView(GuiPE.View.getView(that.title), GuiPE.View.getWidth(that.title), GuiPE.DP(1, 55));
        that.layout_content.setGravity(android.view.Gravity.CENTER | android.view.Gravity.TOP);
        that.layout_content.setOrientation(1);
        
        that.layout_main.setOrientation(1);
        that.layout_main.addView(that.layout_title, that.width, GuiPE.DP(1, 60));
        that.layout_scr.addView(that.layout_content);
        that.layout_main.addView(that.layout_scr, that.width, that.height - GuiPE.DP(1, 80));
        
        that.main.addView(that.layout_main);
        that.window .setBackgroundDrawable(GuiPE.Bitmap.PANEL());
        that.window.setFocusable(true);
        
        return this;
    }
};


/**
 * Bitmap 객체입니다
 * @author 0isback (kimsg0220@naver.com)
 * @namespace Bitmap
 * @memberOf GuiPE
 */
GuiPE.Bitmap = {
    /**
     * @type {android.graphics.Bitmap}
     */
    sheet : GuiPE.getImage("images/gui/spritesheet.png"),

    /**
     * @type {android.graphics.Bitmap}
     */
    touchGUI : GuiPE.getImage("images/gui/touchgui.png"),

    /**
     * @type {android.graphics.Bitmap}
     */
    touchGUI2 : GuiPE.getImage("images/gui/touchgui2.png"),

    /**
     * @type {android.graphics.Bitmap}
     */
    GUI : GuiPE.getImage("images/gui/gui.png"),
    
    /**
     * 나인패치 이미지를 생성합니다
     * @Author Affogatoman
     */
    createNinePatch : function (bitmap, x, y, xx, yy) {
        var NO_COLOR = 0x00000001;
        var buffer = java.nio.ByteBuffer.allocate(84).order(java.nio.ByteOrder.nativeOrder());
        
        buffer.put(0x01);
        buffer.put(0x02);
        buffer.put(0x02);
        buffer.put(0x09);
        buffer.putInt(0);
        buffer.putInt(0);
        buffer.putInt(0);
        buffer.putInt(0);
        buffer.putInt(0);
        buffer.putInt(0);
        buffer.putInt(0);
        buffer.putInt(y);
        buffer.putInt(yy);
        buffer.putInt(x);
        buffer.putInt(xx);
        buffer.putInt(NO_COLOR);
        buffer.putInt(NO_COLOR);
        buffer.putInt(NO_COLOR);
        buffer.putInt(NO_COLOR);
        buffer.putInt(NO_COLOR);
        buffer.putInt(NO_COLOR);
        buffer.putInt(NO_COLOR);
        buffer.putInt(NO_COLOR);
        buffer.putInt(NO_COLOR);
        
        var drawable = new android.graphics.drawable.NinePatchDrawable(GuiPE.getContext().getResources(), bitmap, buffer.array(), new android.graphics.Rect(), null);
        
        return drawable;
    },
    
    /**
     * Bitmap Coding Style like SY
     */
    NORMAL : function () {
        var bitmap = android.graphics.Bitmap.createBitmap(GuiPE.Bitmap.sheet, 8, 32, 8, 8);
        var bit = android.graphics.Bitmap.createScaledBitmap(bitmap, GuiPE.DP(1, 16), GuiPE.DP(1, 16), false);
 
        return GuiPE.Bitmap.createNinePatch(bit, GuiPE.DP(1, 4), GuiPE.DP(1, 4), GuiPE.DP(1, 12), GuiPE.DP(1, 14));
    },

    /**
     * Bitmap Coding Style like SY
     */
    PUSH : function () {
        var bitmap = android.graphics.Bitmap.createBitmap(GuiPE.Bitmap.sheet, 0, 32, 8, 8);
        var bit = android.graphics.Bitmap.createScaledBitmap(bitmap, GuiPE.DP(1, 16), GuiPE.DP(1, 16), false);
 
        return GuiPE.Bitmap.createNinePatch(bit, GuiPE.DP(1, 4), GuiPE.DP(1, 4), GuiPE.DP(1, 12), GuiPE.DP(1, 14));
    },

    /**
     * Bitmap Coding Style like SY
     */
    PANEL : function () {
        var bitmap = android.graphics.Bitmap.createBitmap(GuiPE.Bitmap.sheet, 34, 43, 14, 14);
        var bit = android.graphics.Bitmap.createScaledBitmap(bitmap, GuiPE.DP(1, 28), GuiPE.DP(1, 28), false);
 
        return GuiPE.Bitmap.createNinePatch(bit, GuiPE.DP(1, 4), GuiPE.DP(1, 4), GuiPE.DP(1, 12), GuiPE.DP(1, 14));
    },

    /**
     * Bitmap Coding Style like SY
     */
    SWITCH_ON : function () {
        var bitmap = android.graphics.Bitmap.createBitmap(GuiPE.Bitmap.touchGUI, 198, 206, 38, 19);
        var bit = android.graphics.Bitmap.createScaledBitmap(bitmap, GuiPE.DP(2, 38), GuiPE.DP(2, 19), false);
 
        return bit;
    },

    /**
     * Bitmap Coding Style like SY
     */
    SWITCH_OFF: function () {
        var bitmap = android.graphics.Bitmap.createBitmap(GuiPE.Bitmap.touchGUI, 160, 206, 38, 19);
        var bit = android.graphics.Bitmap.createScaledBitmap(bitmap, GuiPE.DP(2, 38), GuiPE.DP(2, 19), false);
 
        return bit;
    },

    /**
     * Bitmap Coding Style like SY
     */
    SEEKBAR_THUMB : function () {
        var bitmap = android.graphics.Bitmap.createBitmap(GuiPE.Bitmap.touchGUI, 225, 125, 11, 17);
        var bit = android.graphics.Bitmap.createScaledBitmap(bitmap, GuiPE.DP(2, 33), GuiPE.DP(2, 51), false);
        
        return bit;
    },

    /**
     * Bitmap Coding Style like SY
     */
    TOPBAR : function () {
        var bitmap = android.graphics.Bitmap.createBitmap(GuiPE.Bitmap.touchGUI, 150, 26, 14, 30);
        
        for (var i = 0; i < 26; i++) {
            bitmap.setPixel(2, i, bitmap.getPixel(3, i));
            bitmap.setPixel(11, i, bitmap.getPixel(10, i));
        }
        for (var i = 3; i < 11; i++) {
            bitmap.setPixel(i, 25, bitmap.getPixel(i, 26));
            bitmap.setPixel(i, 26, bitmap.getPixel(i, 27));
            bitmap.setPixel(i, 27, bitmap.getPixel(i, 28));
            bitmap.setPixel(i, 28, 0x00000000);
        }
        for (var i = 0; i < 14; i++) {
            bitmap.setPixel(i, 25, bitmap.getPixel(4, 25));
            bitmap.setPixel(i, 26, bitmap.getPixel(4, 26));
            bitmap.setPixel(i, 27, bitmap.getPixel(4, 27));
        }
        
        var bit = android.graphics.Bitmap.createScaledBitmap(bitmap, GuiPE.DP(1, 28), GuiPE.DP(1, 60), false);
        
        return GuiPE.Bitmap.createNinePatch(bit, GuiPE.DP(1, 5), GuiPE.DP(1, 7), GuiPE.DP(1, 46), GuiPE.DP(1, 22));
    },
    

    /**
     * By SY
     */
    EditTextDrawable : function () {
        var O = android.graphics.Color.parseColor("#6B6163");
        var I = android.graphics.Color.parseColor("#393939");
        
        var color = [
            O, O, O, O, O, O, O, O, O, O, O, O,
            O, I, I, I, I, I, I, I, I, I, I, O,
            O, I, I, I, I, I, I, I, I, I, I, O,
            O, I, I, I, I, I, I, I, I, I, I, O,
            O, I, I, I, I, I, I, I, I, I, I, O,
            O, I, I, I, I, I, I, I, I, I, I, O,
            O, I, I, I, I, I, I, I, I, I, I, O,
            O, I, I, I, I, I, I, I, I, I, I, O,
            O, I, I, I, I, I, I, I, I, I, I, O,
            O, I, I, I, I, I, I, I, I, I, I, O,
            O, I, I, I, I, I, I, I, I, I, I, O,
            O, O, O, O, O, O, O, O, O, O, O, O];
            
        var bit = android.graphics.Bitmap.createBitmap(12, 12, android.graphics.Bitmap.Config.ARGB_8888);
        bit.setPixels(color, 0, 12, 0, 0, 12, 12);
        
        var bitmap = android.graphics.Bitmap.createScaledBitmap(bit, GuiPE.DP(1, 24), GuiPE.DP(1, 24), false);
        
        return GuiPE.Bitmap.createNinePatch(bitmap, GuiPE.DP(1, 6), GuiPE.DP(1, 6), GuiPE.DP(1, 18), GuiPE.DP(1, 18));
    },

    /**
     * Bitmap Coding Style like SY
     */
    LAYER :  function () {
        var bitmap = android.graphics.Bitmap.createBitmap(1, 1, android.graphics.Bitmap.Config.ARGB_8888);
        bitmap.setPixels([android.graphics.Color.parseColor("#30000000")], 0, 1, 0, 0, 1, 1);
    
        var bit = android.graphics.Bitmap.createScaledBitmap(bitmap, GuiPE.DP(1, 8), GuiPE.DP(1, 8), false);

        return bit;
    },

    /**
     * Bitmap Coding Style like SY
     */
    Jump : function () {
        var bitmap = android.graphics.Bitmap.createBitmap(GuiPE.Bitmap.GUI, 108, 111, 18, 18);
        var bit = android.graphics.Bitmap.createScaledBitmap(bitmap, GuiPE.DP(1, 36), GuiPE.DP(1, 36), false);

        return new android.graphics.drawable.BitmapDrawable(bit);
    },

    /**
     * Bitmap Coding Style like SY
     */
    DoubleJump : function () {
        var bitmap = android.graphics.Bitmap.createBitmap(GuiPE.Bitmap.GUI, 108, 137, 18, 18);
        var bit = android.graphics.Bitmap.createScaledBitmap(bitmap, GuiPE.DP(1, 36), GuiPE.DP(1, 36), false);

        return new android.graphics.drawable.BitmapDrawable(bit);
    },

    /**
     * Bitmap Coding Style like SY
     */
    FlyUp : function () {
        var bitmap = android.graphics.Bitmap.createBitmap(GuiPE.Bitmap.GUI, 56, 139, 18, 18);
        var bit = android.graphics.Bitmap.createScaledBitmap(bitmap, GuiPE.DP(1, 36), GuiPE.DP(1, 36), false);

        return new android.graphics.drawable.BitmapDrawable(bit);
    },

    /**
     * Bitmap Coding Style like SY
     */
    FlyDown : function () {
        var bitmap = android.graphics.Bitmap.createBitmap(GuiPE.Bitmap.GUI, 82, 135, 18, 18);
        var bit = android.graphics.Bitmap.createScaledBitmap(bitmap, GuiPE.DP(1, 36), GuiPE.DP(1, 36), false);

        return new android.graphics.drawable.BitmapDrawable(bit);
    },

    /**
     * Bitmap Coding Style like SY
     */
    TOOL : function () {
        var bitmap = android.graphics.Bitmap.createBitmap(GuiPE.Bitmap.touchGUI2, 134, 0, 28, 28);
        var bit = android.graphics.Bitmap.createScaledBitmap(bitmap, GuiPE.DP(1, 56), GuiPE.DP(1, 56), false);

        return bit;
    }
};


/**
 * View 객체입니다
 * @author 0isback (kimsg0220@naver.com)
 * @namespace View
 * @memberOf GuiPE
 */
GuiPE.View = {};

/**
 * 상위 객체의 뷰를 가져옵니다
 */
GuiPE.View.getView = function (element) {
    return element.main;
};

/**
 * 상위 객체의 윈도우를 기져옵니디
 */
GuiPE.View.getWindow = function (element) {
    return element.window;
};

/**
 * 상위 객체의 뷰의 너비를 가져옵니다
 */
GuiPE.View.getWidth = function (element) {
    return element.width;
};

/**
 * 상위 객체의 뷰의 높이를 가져옵니다
 */
GuiPE.View.getHeight = function (element) {
    return element.height;
};

/**
 * 상위 객체의 뷰의 너비와 높이를 설정합니다
 */
GuiPE.View.setWH = function (element, width, height) {
    element.width = width;
    element.height = height;
    
    return element;
};

/**
 * 상위 객체의 뷰를 화면에 띄워줍니다
 */
GuiPE.View.show = function (element, gravity, x, y) {
    var that = element;
    
    GuiPE.uiThread ( function () {
        that.window.setContentView(that.main);
        that.window.setWidth(that.width);
        that.window.setHeight(that.height);
        that.window.showAtLocation(GuiPE.getContext().getWindow().getDecorView(), 
            gravity[0] | gravity[1], x, y);
    });
        
    return element;
};

/**
 * 상위 객체의 띄워져 있는 뷰를 닫습니다
 */
GuiPE.View.close = function (element) {
    var that = element;
        
    GuiPE.uiThread ( function () {
        if (that.window != null) {
            that.window.dismiss();
            //that.window = null;
        }
    });
    
    return element;
};


/**
 * FontPE 객체입니다
 * @author Chan (gml1580@naver.com)
 * @modifier 0isback (kimsg0220@naver.com)
 * @namespace FontPE
 */
var FontPE = {};

/**
 * FontPE 캐시파일 객체입니다
 */
FontPE.cache = {};

/**
 * 문자열이 영어로 이루어져있는지 확인합니다
 */
FontPE.isDefault = function (str) { 
    for (var i = 0; i < str.length; i ++)
        if (str.charCodeAt(i) > 127)
            return false;

    return true;
};

/**
 * 문자열의 유니코드값을 가져옵니다
 */
FontPE.getAscii = function (str) { 
    return str.charCodeAt(0);
};

/**
 * 마인크래프트 폰트 이미지를 생성합니다
 */
FontPE.createFontImage = function (gravity, text, color, pushed) {
    var IMAGE = FontPE.getFontImage(text, color);
    const WIDTH = IMAGE.getWidth() / GuiPE.DP(1, 1.5);
    const HEIGHT = GuiPE.DP(1, 20) / GuiPE.DP(1);
    
    IMAGE = FontPE.blankPatch(IMAGE, gravity, 0,
        (pushed == false) ? 0 : 1, WIDTH, HEIGHT);
        
    return {
        Image : IMAGE,
        Width : WIDTH,
        Height : HEIGHT
    };
};

/**
 * 문자열의 구성언어에 따른 폰트이미지를 가져옵니다
 */
FontPE.getFontImage = function (text, color) {
    if (text === "") {
        return null;
    }

    if (FontPE.isDefault(text)) {
        return FontPE.getDefaultImage(text, color);
    } else {
        return FontPE.getGlyphImage(text, color);
    }
};

/**
 * 문자열의 영어 이미지를 가져옵니다
 */
FontPE.getDefaultImage = function (str, color) {
    const LEN = str.length;
    var default8;
    
    if (typeof FontPE.cache["default"] !== "object") {
        default8 = android.graphics.BitmapFactory.decodeStream(ModPE.openInputStreamFromTexturePack("images/font/default8.png"));
        FontPE.cache["default"] = default8;
    } else {
        default8 = FontPE.cache["default"];
    }

    const BITMAP = android.graphics.Bitmap.createBitmap(9 * LEN, 9, android.graphics.Bitmap.Config.ARGB_8888);
    const CANVAS = new android.graphics.Canvas(BITMAP);
    const COLOR = new android.graphics.Paint();
    COLOR.setColorFilter(android.graphics.PorterDuffColorFilter(android.graphics.Color.parseColor(color), 
        android.graphics.PorterDuff.Mode.MULTIPLY));
    const SHADOW = new android.graphics.Paint();
    SHADOW.setColorFilter(android.graphics.PorterDuffColorFilter(android.graphics.Color.DKGRAY,
        android.graphics.PorterDuff.Mode.MULTIPLY));
    const SPACE = new android.graphics.Paint();
    SPACE.setColor(android.graphics.Color.parseColor("#01000000"));

    var char, font, x = 0;
    
    for (var i = 0; i < LEN; i ++) {
        char = str.charCodeAt(i);
        if (char === 32) { //space
            CANVAS.drawRect(x + 4, 0, 1, 1, SPACE);
        } else {
            font = android.graphics.Bitmap.createBitmap(default8, (char % 16) * 8, Math.floor(char / 16) * 8, 8, 8);
            CANVAS.drawBitmap(font, x + 1, 1, SHADOW);
            CANVAS.drawBitmap(font, x, 0, COLOR);
        }
        x = FontPE.getDefaultDrawX(BITMAP, x);
    }
    
    return android.graphics.Bitmap.createScaledBitmap(android.graphics.Bitmap.createBitmap(
        BITMAP, 0, 0, x, 9), GuiPE.DP(2, x), GuiPE.DP(2, 9), false);
};

/**
 * 문자열의 한글 이미지를 가져옵니다
 */
FontPE.getGlyphImage = function (str, color) {
    const LEN = str.length;

    const BITMAP = android.graphics.Bitmap.createBitmap(18*LEN, 17, android.graphics.Bitmap.Config.ARGB_8888);
    const CANVAS = new android.graphics.Canvas(BITMAP);
    const COLOR = new android.graphics.Paint();
    COLOR.setColorFilter(android.graphics.PorterDuffColorFilter(android.graphics.Color.parseColor(color),
        android.graphics.PorterDuff.Mode.MULTIPLY));
    const SHADOW = new android.graphics.Paint();
    SHADOW.setColorFilter(android.graphics.PorterDuffColorFilter(android.graphics.Color.DKGRAY,
        android.graphics.PorterDuff.Mode.MULTIPLY));

    var char, font, x = 0, glyph, hex, fontX;
    
    for (var i = 0; i < LEN; i ++) {
        char = str.charCodeAt(i);
        if (char === 32) { //space
            x += 9;
        } else {
            hex = Math.floor(char/256).toString(16);
            if (hex.length === 1)
                hex = "0" + hex;
            hex = hex.toUpperCase();
            if (typeof FontPE.cache[hex] !== "object") {
                glyph = android.graphics.BitmapFactory.decodeStream(ModPE.openInputStreamFromTexturePack("images/font/glyph_"+hex+".png"));
                FontPE.cache[hex] = glyph;
            } else {
                glyph = FontPE.cache[hex];
            }

            if (char > 256) {
                font = android.graphics.Bitmap.createBitmap(glyph, (char % 256 % 16) * 16, Math.floor(char % 256 / 16) * 16, 16, 16);
            } else {
                font = android.graphics.Bitmap.createBitmap(glyph, (char % 16) * 16, Math.floor(char / 16) * 16, 16, 16);

                fontX = FontPE.getGlyphFontX(font);
                if (fontX !== 0) {
                    font = android.graphics.Bitmap.createBitmap(font, fontX, 0, 16 - fontX, 16);
                }
            }

            CANVAS.drawBitmap(font, x+1, 1, SHADOW);
            CANVAS.drawBitmap(font, x, 0, COLOR);
            x = FontPE.getGlyphDrawX(BITMAP, x, hex === "00", i === LEN - 1);
        }
    }

    return android.graphics.Bitmap.createScaledBitmap(android.graphics.Bitmap.createBitmap(
        BITMAP, 0, 0, x, 17), GuiPE.DP(2, x) / 2, GuiPE.DP(2, 17) / 2, false);
};

/**
 * 폰트이미지의 움직임을 패치합니다
 */
FontPE.blankPatch = function (bitmap, gravity, plusX, plusY, width, height) {
    const WIDTH = GuiPE.DP(2, width);
    const HEIGHT = GuiPE.DP(2, height);
    const BITMAP = android.graphics.Bitmap.createBitmap(WIDTH, HEIGHT, android.graphics.Bitmap.Config.ARGB_8888);
    const CANVAS = new android.graphics.Canvas(BITMAP);
    var x = 0, y = 0;
    
    switch (gravity) {
        case android.view.Gravity.LEFT:
            x = 0;
            y = (HEIGHT-bitmap.getHeight()) / 2;
            break;

        case android.view.Gravity.RIGHT:
            x = WIDTH - bitmap.getWidth();
            y = (HEIGHT-bitmap.getHeight()) / 2;
            break;

        case android.view.Gravity.CENTER:
            x = (WIDTH-bitmap.getWidth()) / 2;
            y = (HEIGHT-bitmap.getHeight()) / 2;
            break;

        case android.view.Gravity.TOP:
            x = (WIDTH-bitmap.getWidth()) / 2;
            y = 0;
            break;

        case android.view.Gravity.BOTTOM:
            x = (WIDTH-bitmap.getWidth()) / 2;
            y = HEIGHT - bitmap.getHeight();
            break;
    }
    
    CANVAS.drawBitmap(bitmap, x + GuiPE.DP(2, plusX), y + GuiPE.DP(2, plusY), null);
    
    return BITMAP;
};

/**
 * 영어 이미지의 x좌표의 픽셀값을 확인하여 가져옵니다
 */
FontPE.getDefaultDrawX = function (bitmap, startX) {
    for (var x = startX + 2, w = bitmap.getWidth(); x < w; x ++)
        if (bitmap.getPixel(x, 0) === 0 && bitmap.getPixel(x, 1) === 0 && bitmap.getPixel(x, 2) === 0 &&
            bitmap.getPixel(x, 3) === 0 && bitmap.getPixel(x, 4) === 0 && bitmap.getPixel(x, 5) === 0 &&
            bitmap.getPixel(x, 6) === 0 && bitmap.getPixel(x, 7) === 0 && bitmap.getPixel(x, 8) === 0)
            return x;

    return 0;
};

/**
 * 한글 이미지의 x좌표의 픽셀값을 확인하여 가져옵니다
 */
FontPE.getGlyphDrawX = function (bitmap, startX, isAscii, isLast) {
    for (var x = startX + (isAscii ? 4 : 11), w = bitmap.getWidth(); x < w; x ++)
        if (bitmap.getPixel(x, 0) === 0 && bitmap.getPixel(x, 2) === 0 && bitmap.getPixel(x, 4) === 0 &&
            bitmap.getPixel(x, 6) === 0 && bitmap.getPixel(x, 8) === 0 && bitmap.getPixel(x, 10) === 0 &&
            bitmap.getPixel(x, 12) === 0 && bitmap.getPixel(x, 14) === 0 && bitmap.getPixel(x, 16) === 0 &&
            bitmap.getPixel(x+1, 0) === 0 && bitmap.getPixel(x+1, 2) === 0 && bitmap.getPixel(x+1, 4) === 0 &&
            bitmap.getPixel(x+1, 6) === 0 && bitmap.getPixel(x+1, 8) === 0 && bitmap.getPixel(x+1, 10) === 0 &&
            bitmap.getPixel(x+1, 12) === 0 && bitmap.getPixel(x+1, 14) === 0 && bitmap.getPixel(x+1, 16) === 0) {
            if (isAscii || isLast) {
                return x;
            } else {
                return x + (x-startX === 16 ? 2 : 1);
            }
        }

    return 0;
};

/**
 * 한글 이미지의 픽셀값에 따른 x값을 가져옵니다
 */
FontPE.getGlyphFontX = function (bitmap) {
    for (var x = 1; x < 16; x ++)
        if (bitmap.getPixel(x, 0) !== 0 || bitmap.getPixel(x, 2) !== 0 || bitmap.getPixel(x, 4) !== 0 ||
            bitmap.getPixel(x, 6) !== 0 || bitmap.getPixel(x, 8) !== 0 || bitmap.getPixel(x, 10) !== 0 ||
            bitmap.getPixel(x, 12) !== 0 || bitmap.getPixel(x, 14) !== 0 || bitmap.getPixel(x, 15) !== 0)
            return x - 1;

    return 0;
};

/**
 * GuiPE 객체를 다른 스크립트에 등록합니다
 */
function selectLevelHook() {
    var scripts = net.zhuoweizhang.mcpelauncher.ScriptManager.scripts;
 
    for (var i = 0; i < scripts.size(); i ++) {
        var script = scripts.get(i);
        var scope = script.scope;
        org.mozilla.javascript.ScriptableObject.putProperty(scope, "GuiPE", GuiPE);
    }
}
