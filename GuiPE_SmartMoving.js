var SM = {};

SM.Active = false;
SM.UseSmartMoving = false;

SM.Option = null;
SM.OptionButton = null;
SM.ControlBar = null;
SM.LangWindow = null;
SM.ControlCustomWindow = null;

SM.JumpBar = null;
SM.EnergyBar = null;

var pe, px, py, pz, yaw, pitch, sin, cos, pcos;

/**
 * 스마트무빙의 언어관련 객체입니다
 * @author 0isback (kimsg0220@naver.com)
 * @since 2016.10.18
 */
SM.Lang;
SM.LangStr = {
	Option : {
		Title : {
			eng : "SmartMoving Options",
			kor : "스마트무빙 설정"
		},
		Back : {
			eng : "Back",
			kor : "뒤로가기"
		},
		Game : {
			eng : "Game",
			kor : "게임"
		},
		Use : {
			eng : "Use SmartMoving",
			kor : "스마트무빙 사용"
		},
		Control : {
			eng : "Control",
			kor : "컨트롤"
		},
		Customize : {
			eng : "Customize Controls",
			kor : "컨트롤 기능 골라쓰기"
		},
		CustomizeButton : {
			eng : "Customize",
			kor : "사용자 지정"
		}
	},
	OptionButton : {
		Text : {
			eng : "SmartMoving Options",
			kor : "스마트무빙 설정"
		}
	},
	Control : {
		Title : {
			eng : "< Customize Control >",
			kor : "< 컨트롤 사용자 지정 >"
		},
		UseJump : {
			eng : "Use SuperJump",
			kor : "슈퍼점프 사용하기"
		},
		UseSprint : {
			eng : "Use Sprint",
			kor : "스프린트 사용하기"
		},
		SetSpeed : {
			eng : "- Set Sprint Speed",
			kor : "- 스프린트 속도 설정"
		},
		UseClimb : {
			eng : "Use Climbing",
			kor : "벽타기 사용하기"
		},
		UseSwim : {
			eng : "Use Swimming",
			kor : "수영 사용하기"
		},
	}
};

/**
 * 스마트무빙의 모드관련 객체입니다
 * @author 0isback (kimsg0220@naver.com)
 * @since 2016.10.18
 */
SM.Mode = {};
SM.Mode.Jump = false;
SM.Mode.Sprint = false;
SM.Mode.SprintSpeed = {
	Slow : 0.3,
	Normal : 0.4,
	Fast : 0.55
};
SM.Mode.NowSpeed = SM.Mode.SprintSpeed.Normal;
SM.Mode.Climb = false;
SM.Mode.isClimbing = false;
SM.Mode.Dive = false;
SM.Mode.isSwimming = false;
SM.Mode.Drown = false;
SM.Mode.inLiquid = false;

/**
 * 스마트무빙의 모드 관련 쓰레드 입니다
 * @author 0isback (kimsg0220@naver.com)
 */
SM.Mode.Run = function () {
	GuiPE.uiThread( function () {
		if (SM.Control.Use.SuperJump && SM.Mode.Jump
			|| SM.Mode.Dive) {
			SM.Mode.Climb = false;
			SM.JumpBar.show();
			if (SM.JumpBar.getValue() < 20) {
				SM.JumpBar.setValue(
					SM.JumpBar.getValue() + 1);
			}
		} else if (SM.JumpBar.getValue() > 0) {
			SM.JumpBar.setValue(0);
			SM.JumpBar.destroy();
		}
		
		if (SM.Control.Use.Sprint && SM.Mode.Sprint) {
			SM.EnergyBar.show();
			if (SM.EnergyBar.getValue() > 0) {
				SM.EnergyBar.setValue(
					SM.EnergyBar.getValue() - 0.5);
				if (SM.EnergyBar.getValue() > 8) {
					setVelX(pe, sin * SM.Mode.NowSpeed);
					setVelZ(pe, cos * SM.Mode.NowSpeed);
				}
			}
		} else if (SM.EnergyBar.getValue() < 20) {
			SM.EnergyBar.setValue(
				SM.EnergyBar.getValue() + 0.5);
		} else if (SM.EnergyBar.getValue() == 20) {
			SM.EnergyBar.destroy();
		}
		
		if (SM.Control.Use.Climb && SM.Mode.Climb) {
			SM.Mode.Sprint = false;
			if (!SM.Entity.isAbleToClimb(pe,  1)) {
				if (SM.Entity.isAbleToClimb(pe, 1) || 
					SM.Entity.isAbleToClimb(pe, 0) || SM.Entity.isAbleToClimb(pe, -1)) {
					SM.Mode.isClimbing = true;
				}
			}
			if (SM.Mode.isClimbing == true && SM.Entity.isAbleToClimb(pe, 0) == false && 
				SM.Entity.isAbleToClimb(pe, -1) == false && SM.Entity.isAbleToClimb(pe, -1.8) == false) {
				SM.Mode.isClimbing = false;
				Entity.setVelX(pe, sin * 0.12);
				Entity.setVelZ(pe, cos * 0.12);
			}
		} else {
			SM.Mode.isClimbing = false;
		}
		
	});
};

/**
 * 스마트무빙의 컨트롤 객체입니다
 * @author 0isback (kimsg0220@naver.com)
 * @since 2016.10.18
 */
SM.Control = {};
SM.Control.Normal = null;
SM.Control.Double = null;
SM.Control.Up = null;
SM.Control.Down = null;
SM.Control.Release = null;
SM.Control.Use = {
	SuperJump : true,
	Sprint : true,
	Climb : true,
	Swim : false
};

/**
 * 스마트무빙의 컨트롤 관련 쓰레드 입니다
 * @author 0isback (kimsg0220@naver.com)
 */
SM.Control.Run = function () {
	GuiPE.uiThread ( function () {
		if (SM.ControlBar != null) {
			var VIEW = SM.ControlBar.getView();
			SM.Control.Normal = VIEW.Normal;
			SM.Control.Double = VIEW.Double;
			SM.Control.Up = VIEW.Up;
			SM.Control.Down = VIEW.Down;
			SM.Control.Release = VIEW.Release;
		
			if (SM.Control.Normal) {
				SM.Mode.Climb = true;
				if (SM.Entity.isRunning(pe))
					SM.Mode.Sprint = true;
				else
					SM.Mode.Sprint = false;
					
				if (SM.Entity.isSneaking(pe) 
					&& SM.Entity.isStandingOnBlock(pe))
					SM.Mode.Jump = true;
				else
					SM.Mode.Jump = false;
				
				if (SM.Mode.isSwimming) {
					if (SM.Entity.isMoving(pe))
						SM.Mode.Sprint = true;
					else
						SM.Mode.Sprint = false;
				}
				
			} else {
				SM.Mode.Jump = false;
				SM.Mode.Climb = false;
			}
			
			if (SM.Control.Double) {
				if (SM.Control.Up) {
					if (SM.Entity.isRunning(pe))
						SM.Mode.Dive = true;
					else
						SM.Mode.Dive = false;
				} else {
					SM.Mode.Dive = false;
				}
				
				if (SM.Control.Down) {
					if (SM.Mode.isSwimming)
						SM.Mode.Drown = true;
				} else {
					SM.Mode.Drown = false;
				}
				
			} else {
				SM.Mode.Dive = false;
				SM.Mode.Drown = false;
			}
			
			if (SM.Control.Release) {
				if (SM.Entity.isSneaking(pe) 
					&& SM.Entity.isStandingOnBlock(pe))
					setVelY(pe, SM.JumpBar.getValue() * 0.04);
				
				SM.Mode.Jump = false;
				SM.Mode.Sprint = false;
				SM.Mode.Climb = false;
				SM.Mode.Dive = false;
			}
		}
	});
};

/**
 * 스마트무빙의 초기 설정입니다
 * @author 0isback (kimsg0220@naver.com)
 */
SM.Control.FirstSetting = function () {
	SM.Control.Use.Swim = false;
	SM.Mode.NowSpeed = SM.Mode.SprintSpeed.Normal;
};

/**
 * 스마트무빙의 GUI 객체입니다
 * @author 0isback (kimsg0220@naver.com)
 * @since 2016.10.18
 */
SM.GUI = {};

/**
 * 화면 하단에 이미지바를 생성합니다
 * @author SY
 * @modifier 0isback (kimsg0220@naver.com)
 */
SM.GUI.ImageBar = function (fullImage, halfImage, backImage, widthMargin, heightMargin, isReverse) {
	var window = new android.widget.PopupWindow(GuiPE.getContext());
	var layout = new android.widget.LinearLayout(GuiPE.getContext());
	window.setTouchable(false);
	
	var image = new Array();
	var _value = 0;
	
	for (var i = 0; i < 10; i++) {
		if (!isReverse) {
			image[i] = new android.widget.ImageView(GuiPE.getContext());
			layout.addView(image[i], GuiPE.DP(1, 15), GuiPE.DP(1, 15));
		} else if (isReverse) {
			image[9 - i] = new android.widget.ImageView(GuiPE.getContext());
			layout.addView(image[9 - i], GuiPE.DP(1, 15), GuiPE.DP(1, 15));
		}
	}
	
	this.setValue = function (value) {
		var last = 0;
		_value = value;
	 
		for (var i = 0; i < 10; i++) {
			if (i < _value / 2) {
				image[i].setImageBitmap(fullImage);
				last++;
			} else {
				image[i].setImageBitmap(null);
				if (backImage != null)
				 image[i].setImageBitmap(backImage);
			}
		}
		if (_value % 2 == 1 && _value != 0)
			image[last-1].setImageBitmap(halfImage);
	};
	
	this.getValue = function () {
		return _value;
	};
	
	this.show = function () {
		GuiPE.uiThread( function () {
			window.setContentView(layout);
			window.setBackgroundDrawable(null);
			window.setWidth(GuiPE.DP(1, 150));
			window.setHeight(GuiPE.DP(1, 15));
			window.showAtLocation(GuiPE.getContext().getWindow().getDecorView(),
				android.view.Gravity.CENTER | android.view.Gravity.BOTTOM, GuiPE.DP(1, widthMargin), GuiPE.DP(1, heightMargin));
		});
	};
	
	this.destroy = function () {
		GuiPE.uiThread( function () {
			window.dismiss();
			//window = null;
		});
	};
};

/**
 * 스마트무빙의 GUI의 컨트롤 관련 객체입니다
 * @author 0isback (kimsg0220@naver.com)
 * @since 2016.10.18
 */
SM.GUI.Control = {};
SM.GUI.Control.TouchCount = 0;
SM.GUI.Control.Count = 0;
SM.GUI.Control.onTouch = false;
SM.GUI.Control.onTouchCount = 0;
SM.GUI.Control.release = false;

/**
 * 컨트롤 버튼을 생성합니다
 * @author 0isback (kimsg0220@naver.com)
 */
SM.GUI.Control.Button = function () {
	var Double = false;
	var Normal = false
	var Up = false
	var Down = false;
	
	var window = new android.widget.PopupWindow(GuiPE.getContext());
	var layout = new android.widget.LinearLayout(GuiPE.getContext());
	
	var button = new GuiPE.Widget.GUIButton()
		.setBitmap(GuiPE.Bitmap.Jump())
		.render();
	var buttonUp= new GuiPE.Widget.GUIButton()
		.setBitmap(GuiPE.Bitmap.FlyUp())
		.render();
	var buttonDown = new GuiPE.Widget.GUIButton()
		.setBitmap(GuiPE.Bitmap.FlyDown())
		.render();
		
	var m_ml1 = new android.widget.LinearLayout(GuiPE.getContext());
	var m_ml2 = new android.widget.LinearLayout(GuiPE.getContext());
	
	GuiPE.View.getView(button).setOnTouchListener ( new android.view.View.OnTouchListener ( {
		onTouch : function (view, event) {
			const ACTION = event.getAction();
			const MOTION = android.view.MotionEvent;
    
			if (ACTION == MOTION.ACTION_DOWN) {
				SM.GUI.Control.onTouch = true;
				
				view.setImageBitmap(GuiPE.Bitmap.LAYER());
				SM.GUI.Control.TouchCount ++;
				
				if (SM.GUI.Control.TouchCount >= 2) {
					GuiPE.View.getView(buttonUp).setVisibility(android.view.View.VISIBLE);
					GuiPE.View.getView(buttonDown).setVisibility(android.view.View.VISIBLE);
					GuiPE.View.getView(button).setBackgroundDrawable(GuiPE.Bitmap.DoubleJump());
					
					Normal = false;
					Double = true;
				} else {
					SM.GUI.Control.Count = 4;
					Normal = true;
				}
			} else if (ACTION == MOTION.ACTION_MOVE) {
				SM.GUI.Control.onTouch = true;
				
				if (Double) {
					var m_coordY = event.getRawY();
					
					if ((GuiPE.HEIGHT - GuiPE.DP(1, 55)) < m_coordY) {
						Up = false;
						Down = true;
						GuiPE.View.getView(buttonUp).setImageBitmap(null);
						GuiPE.View.getView(buttonDown).setImageBitmap(GuiPE.Bitmap.LAYER());
					} else if ((GuiPE.HEIGHT - GuiPE.DP(1, 105)) > m_coordY) {
						Up = true;
						Down = false;
						GuiPE.View.getView(buttonUp).setImageBitmap(GuiPE.Bitmap.LAYER());
						GuiPE.View.getView(buttonDown).setImageBitmap(null);
					} else {
						Up = false;
						Down = false;
						GuiPE.View.getView(buttonUp).setImageBitmap(null);
						GuiPE.View.getView(buttonDown).setImageBitmap(null);
					}
				}
			} else if (ACTION == MOTION.ACTION_UP) {
				if (Normal)
					SM.GUI.Control.onTouchCount = 2;//release
				
				Normal = false;
				Double = false;
				Up = false;
				Down = false;
				
				view.setImageBitmap(null);
				
				GuiPE.View.getView(button).setBackgroundDrawable(GuiPE.Bitmap.Jump());
				GuiPE.View.getView(buttonUp).setImageBitmap(null);
				GuiPE.View.getView(buttonDown).setImageBitmap(null);
				
				GuiPE.View.getView(buttonUp).setVisibility(android.view.View.GONE);
				GuiPE.View.getView(buttonDown).setVisibility(android.view.View.GONE);
			}
			return false;
		}
	}));
		
	GuiPE.View.getView(buttonUp).setVisibility(android.view.View.GONE);
	GuiPE.View.getView(buttonDown).setVisibility(android.view.View.GONE);
	
	m_ml1.setGravity(android.view.Gravity.TOP | android.view.Gravity.CENTER);
	m_ml2.setGravity(android.view.Gravity.BOTTOM | android.view.Gravity.CENTER);
	m_ml1.addView(GuiPE.View.getView(buttonUp), GuiPE.DP(1, 35), GuiPE.DP(1, 35));
	m_ml2.addView(GuiPE.View.getView(buttonDown), GuiPE.DP(1, 35), GuiPE.DP(1, 35));
	//buttons
	
	layout.setOrientation(1);
	layout.setGravity(android.view.Gravity.CENTER | android.view.Gravity.CENTER);
	layout.addView(m_ml1, GuiPE.DP(1, 40), GuiPE.DP(1, 50));
	layout.addView(GuiPE.View.getView(button), GuiPE.DP(1, 40), GuiPE.DP(1, 40));
	layout.addView(m_ml2, GuiPE.DP(1, 40), GuiPE.DP(1, 50));
	//layout
	
	this.getView = function () {
		return {
			Normal : Normal,
			Double : Double,
			Up : Up,
			Down : Down,
			Release : SM.GUI.Control.release
		}
	};
	
	this.show = function () {
		GuiPE.uiThread( function () {
			window.setContentView(layout);
			window.setBackgroundDrawable(null);
			window.setWidth(GuiPE.DP(1, 40));
			window.setHeight(GuiPE.DP(1, 140));
			window.showAtLocation(GuiPE.getContext().getWindow().getDecorView(),
				android.view.Gravity.RIGHT | android.view.Gravity.BOTTOM, GuiPE.DP(1, 5), GuiPE.DP(1, 20));
		});
	};
	
	this.dismiss = function () {
		GuiPE.uiThread( function () {
			window.dismiss();
			window = null;
		});
	};
};

/**
 * 언어선택 창을 생성합니다
 * @author 0isback (kimsg0220@naver.com)
 */
SM.GUI.SelectLangWindow = function () {
	var window = new android.widget.PopupWindow(GuiPE.getContext());
	var layout = new android.widget.LinearLayout(GuiPE.getContext());
	var layout_title = new android.widget.LinearLayout(GuiPE.getContext());
	var layout_content = new android.widget.LinearLayout(GuiPE.getContext());
	
	var title = new GuiPE.Widget.TextView()
		.setText("< Select Language >")
		.render();
	var width = GuiPE.View.getWidth(title);
	var height = GuiPE.View.getHeight(title);
	
	var button_eng = new GuiPE.Widget.Button()
		.setText("English")
		.setOnClickListener(function () {
			window.dismiss();
			window = null;
			var toast = new GuiPE.Widget.Toast()
				.setText("Language is set to English.")
				.render()
				.show();
			
			SM.Lang = "eng";
			SM.GUI.RenderWidget();
		})
		.render();
	var button_kor = new GuiPE.Widget.Button()
		.setText("한국어")
		.setOnClickListener(function () {
			window.dismiss();
			window = null;
			var toast = new GuiPE.Widget.Toast()
				.setText("언어가 한국어로 설정되었습니다.")
				.render()
				.show();
			
			SM.Lang = "kor";
			SM.GUI.RenderWidget();
		})
		.render();
		
	layout_title.addView(GuiPE.View.getView(title));
	layout_content.setPadding(GuiPE.DP(1, 10), GuiPE.DP(1, 10), GuiPE.DP(1, 10), GuiPE.DP(1, 10));
	layout_content.addView(GuiPE.View.getView(button_eng),
		width / 2.5, GuiPE.View.getHeight(button_eng));
	layout_content.addView(GuiPE.View.getView(button_kor),
		width / 2.5, GuiPE.View.getHeight(button_kor));
	layout_content.setGravity(
		android.view.Gravity.CENTER | android.view.Gravity.CENTER);
			
	layout.setPadding(GuiPE.DP(1, 0), GuiPE.DP(1, 10), GuiPE.DP(1, 0), GuiPE.DP(1, 10));
	layout.setOrientation(1);
	layout.addView(layout_title);
	layout.addView(layout_content);
		
	this.show = function () {
		GuiPE.uiThread( function () {
			window.setContentView(layout);
			window.setBackgroundDrawable(GuiPE.Bitmap.PANEL());
			window.setWidth(width);
			window.setHeight(height * 3);
			window.showAtLocation(GuiPE.getContext().getWindow().getDecorView(), 
				android.view.Gravity.CENTER | android.view.Gravity.CENTER, 0, 0);
		});
	};
		
	this.dismiss = function () {
		GuiPE.uiThread( function () {
			window.dismiss();
			window = null;
		});
	};
};

/**
 * 점프바를 생성합니다
 * @author 0isback (kimsg0220@naver.com)
 */
SM.GUI.JumpBar = function () {
	var bar = new SM.GUI.ImageBar(SM.GUI.Image.FullJump(), SM.GUI.Image.HalfJump(), null, - 105, 60, false);
	bar.setValue(0);
 
	return bar;
};

/**
 * 에너지바를 생성합니다
 * @author 0isback (kimsg0220@naver.com)
 */
SM.GUI.EnergyBar = function () {
	var bar = new SM.GUI.ImageBar(SM.GUI.Image.FullEnergy(), SM.GUI.Image.HalfEnergy(), null, 105, 60, true);
	bar.setValue(0);
 
	return bar;
};

/**
 * 스마트무빙의 위젯들을 랜더링합니다
 * @author 0isback (kimsg0220@naver.com)
 */
SM.GUI.RenderWidget = function () {
	try {
	SM.LangWindow = null;
	
	SM.Option = new GuiPE.Widget.Option()
		//.setTitle(SM.LangStr.Option.Title[SM.Lang])
		//.setCloseText(SM.LangStr.Option.Back[SM.Lang])
		.addSlot(GuiPE.Bitmap.TOOL())
		.addCategory(SM.LangStr.Option.Game[SM.Lang])
		/*.addSwitch(SM.LangStr.Option.Use[SM.Lang], false, function (checked) {
			if (checked) {
				SM.ControlBar = new SM.GUI.Control.Button();
				SM.ControlBar.show();
				SM.UseSmartMoving = true;
			} else {
				SM.ControlBar.dismiss();
				SM.UseSmartMoving = false;
			}
		})
		.addCategory(SM.LangStr.Option.Control[SM.Lang])
		.addButton(SM.LangStr.Option.Customize[SM.Lang], 
			SM.LangStr.Option.CustomizeButton[SM.Lang], function () {
			GuiPE.View.show(SM.ControlCustomWindow, 
				[android.view.Gravity.CENTER, android.view.Gravity.CENTER], 0, 0);
		})*/
		.addSlot(null)
		.render();
	//Option
		
	SM.OptionButton = new GuiPE.Widget.Button()
		.setText(SM.LangStr.OptionButton.Text[SM.Lang])
		.setBackground(false)
		.setOnClickListener(function () {
			GuiPE.View.show(SM.Option, 
				[android.view.Gravity.RIGHT, android.view.Gravity.BOTTOM], 0, 0);
		})
		.render();
		
	GuiPE.View.show(SM.OptionButton, 
		[android.view.Gravity.LEFT, android.view.Gravity.TOP], 0, 70);
	//OptionButton
	
	SM.JumpBar = new SM.GUI.JumpBar();
	SM.EnergyBar = new SM.GUI.EnergyBar();
	//ImageBar
	
	SM.ControlCustomWindow = new GuiPE.Widget.CustomWindow()
		.setTitle(SM.LangStr.Control.Title[SM.Lang])
		.addSwitch(SM.LangStr.Control.UseJump[SM.Lang], true, function (checked) {
			SM.Control.Use.SuperJump = (checked) ? true : false;
		})
		.addSwitch(SM.LangStr.Control.UseSprint[SM.Lang], true, function (checked) {
			SM.Control.Use.Sprint = (checked) ? true : false;
		})
		.addSeekBar(SM.LangStr.Control.SetSpeed[SM.Lang], 2, 1, function (value) {
			if (value == 0) SM.Mode.NowSpeed = SM.Mode.SprintSpeed.Slow;
			if (value == 1) SM.Mode.NowSpeed = SM.Mode.SprintSpeed.Normal;
			if (value == 2) SM.Mode.NowSpeed = SM.Mode.SprintSpeed.Fast;
		})
		.addSwitch(SM.LangStr.Control.UseClimb[SM.Lang], true, function (checked) {
			SM.Control.Use.Climb = (checked) ? true : false;
		})
		.addSwitch(SM.LangStr.Control.UseSwim[SM.Lang], false, function (checked) {
			SM.Control.Use.Swim = (checked) ? true : false;
		})
		.render();
	//ControlCustomWindow
	
	SM.Active = true;
	SM.Control.FirstSetting();
	} catch (e) {
		GuiPE.Debug(e);
	}
};

/**
 * 스마트무빙의 위젯들을 모두 닫습니다
 * @author 0isback (kimsg0220@naver.com)
 */
SM.GUI.destroy = function () {
	if (SM.LangWindow != null) {
		SM.LangWindow.dismiss();
		SM.LangWindow = null;
	}
	if (SM.OptionButton != null) {
		GuiPE.View.close(SM.OptionButton);
		SM.OptionButton = null;
	}
	if (SM.ControlBar != null) {
		SM.ControlBar.dismiss();
		SM.ControlBar = null;
	}
	if (SM.JumpBar != null) {
		SM.JumpBar.destroy();
		SM.JumpBar = null;
	}
	if (SM.EnergyBar != null) {
		SM.EnergyBar.destroy();
		SM.EnergyBar = null;
	}
	SM.Active = false;
};

/**
 * 스마트무빙의 이미지 객체입니다
 * @author 0isback (kimsg0220@naver.com)
 * @since 2016.10.18
 */
SM.GUI.Image = {};

/**
 * 점프바 이미지입니다
 * @author 0isback (kimsg0220@naver.com)
 */
SM.GUI.Image.FullJump = function () {
	var B = android.graphics.Color.parseColor("#FF1499FF");
	var b = android.graphics.Color.parseColor("#FF0526FF");
	var D = android.graphics.Color.parseColor("#FF000000");
	
	//9×9 bitmap
	var color = [
	0, 0, 0, 0, D, 0, 0, 0, 0,
	0, 0, 0, D, B, D, 0, 0, 0,
	0, 0, D, B, B, B, D, 0, 0,
	0, D, B, B, B, B, B, D, 0,
	D, b, b, B, B, B, b, b, D,
	0, D, D, B, B, B, D, D, 0,
	0, 0, D, B, B, B, D, 0, 0,
	0, 0, D, b, b, b, D, 0, 0,
	0, 0, 0, D, D, D, 0, 0, 0];
	
	var bit = android.graphics.Bitmap.createBitmap(9, 9, android.graphics.Bitmap.Config.ARGB_8888);
	bit.setPixels(color, 0, 9, 0, 0, 9, 9);
	
	var bitmap = android.graphics.Bitmap.createScaledBitmap(bit, GuiPE.DP(1, 32), GuiPE.DP(1, 32), false);
	
	return bitmap;
};

/**
 * 점프바 절반 이미지입니다
 * @author 0isback (kimsg0220@naver.com)
 */
SM.GUI.Image.HalfJump = function () {
	var B = android.graphics.Color.parseColor("#FF1499FF");
	var b = android.graphics.Color.parseColor("#FF0526FF");
	var D = android.graphics.Color.parseColor("#FF000000");
 
	//9×9 bitmap
	var color = [
	0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, D, 0, 0, 0, 0,
	0, 0, 0, D, B, D, 0, 0, 0,
	0, 0, D, B, B, B, D, 0, 0,
	0, D, b, b, B, b, b, D, 0,
	0, 0, 0, D, B, D, 0, 0, 0,
	0, 0, 0, D, B, D, 0, 0, 0,
	0, 0, 0, D, b, D, 0, 0, 0,
	0, 0, 0, 0, D, 0, 0, 0, 0];
	
	var bit = android.graphics.Bitmap.createBitmap(9, 9, android.graphics.Bitmap.Config.ARGB_8888);
	bit.setPixels(color, 0, 9, 0, 0, 9, 9);
	
	var bitmap = android.graphics.Bitmap.createScaledBitmap(bit, GuiPE.DP(1, 32), GuiPE.DP(1, 32), false);
	
	return bitmap;
};

/**
 * 에너지바 이미지입니다
 * @author 0isback (kimsg0220@naver.com)
 */
SM.GUI.Image.FullEnergy = function () {
	var Y = android.graphics.Color.parseColor("#FFFFFF00");
	 
	//9×9 bitmap
	var color = [
	0, 0, 0, 0, 0, Y, 0, 0, 0,	
	0, 0, 0, 0, Y, 0, 0, 0, 0,
	0, 0, 0, Y, Y, 0, 0, 0, 0,
	0, 0, Y, Y, 0, 0, 0, 0, 0,
	0, 0, Y, Y, Y, Y, Y, 0, 0,
	0, 0, 0, 0, 0, Y, Y, 0, 0,
	0, 0, 0, 0, Y, Y, 0, 0, 0,
	0, 0, 0, 0, Y, 0, 0, 0, 0,
	0, 0, 0, Y, 0, 0, 0, 0, 0];
	
	var bit = android.graphics.Bitmap.createBitmap(9, 9, android.graphics.Bitmap.Config.ARGB_8888);
	bit.setPixels(color, 0, 9, 0, 0, 9, 9);
	var bitmap = android.graphics.Bitmap.createScaledBitmap(bit, GuiPE.DP(1, 32), GuiPE.DP(1, 32), false);

	return bitmap;
};

/**
 * 에너지바 절반 이미지입니다
 * @author 0isback (kimsg0220@naver.com)
 */
SM.GUI.Image.HalfEnergy = function () {
	var Y = android.graphics.Color.parseColor("#FFFFFF00");
	var W = android.graphics.Color.parseColor("#FFFFFFFF");

	//9×9 bitmap
	var color = [
	0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, W, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, Y, 0, W, 0, 0,
	0, 0, 0, Y, 0, 0, 0, 0, 0,
	0, 0, 0, Y, Y, Y, 0, 0, 0,
	0, 0, 0, 0, 0, Y, 0, 0, 0,
	0, 0, W, 0, Y, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, W, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0];
 
	var bit = android.graphics.Bitmap.createBitmap(9, 9, android.graphics.Bitmap.Config.ARGB_8888);
	bit.setPixels(color, 0, 9, 0, 0, 9, 9);

	var bitmap = android.graphics.Bitmap.createScaledBitmap(bit, GuiPE.DP(1, 32), GuiPE.DP(1, 32), false);

	return bitmap;
};

/**
 * 스마트무빙의 엔티티 객체입니다
 * @author 0isback (kimsg0220@naver.com)
 * @since 2016.10.19
 */
SM.Entity = {};

/**
 * 엔티티의 속도를 가져옵니다
 */
SM.Entity.getSpeed = function (ent) {
	return Math.sqrt(Entity.getVelX(ent) * Entity.getVelX(ent) + Entity.getVelZ(ent) * Entity.getVelZ(ent));
};

/**
 * 엔티티가 숙이고 있는지 여부를 확인합니다
 */
SM.Entity.isSneaking = function (ent) {
	return (Entity.isSneaking(ent)) ? true : false;
};

/**
 * 엔티티가 움직이고 있는지 여부를 확인합니다
 */
SM.Entity.isMoving = function (ent) {
	return (SM.Entity.getSpeed(ent) > 0.05) ? true : false;
};

/**
 * 엔티티가 달리고 있는지 여부를 확인합니다
 */
SM.Entity.isRunning = function (ent) {
	return (SM.Entity.getSpeed(ent) > 0.13) ? true : false;
};

/**
 * 엔티티가 블럭위에 서있는지 여부를 확인합니다
 */
SM.Entity.isStandingOnBlock = function (ent) {
	return (getTile(Entity.getX(ent), Entity.getY(ent) - 2, Entity.getZ(ent)) > 0) ? true : false;
};

/**
 * 제한된 블럭들의 리스트입니다
 */
SM.Entity.BannedBlockList = [
	{ name : "묘목", blockID : 6 },
	{ name : "물", blockID : 9 },
	{ name : "용암", blockID : 11 },
	{ name : "파워 레일", blockID : 27 },
	{ name : "디텍터 레일", blockID : 28 },
	{ name : "거미줄", blockID : 30 },
	{ name : "덤불", blockID : 31 },
	{ name : "노란꽃", blockID : 37 },
	{ name : "빨간꽃", blockID : 38 },
	{ name : "갈색버섯", blockID : 39 },
	{ name : "빨간버섯", blockID : 40 },
	{ name : "토치", blockID : 50 },
	{ name : "불", blockID : 51 },
	{ name : "레드스톤 가루", blockID : 55 },
	{ name : "작물", blockID : 59 },
	{ name : "표지판", blockID : 63 },
	{ name : "나무문", blockID : 64 },
	{ name : "사다리", blockID : 65 },
	{ name : "레일", blockID : 66 },
	{ name : "벽표지판", blockID : 68 },
	{ name : "레버", blockID : 69 },
	{ name : "돌 감압판", blockID : 70 },
	{ name : "철문", blockID : 71 },
	{ name : "나무 감압판", blockID : 72 },
	{ name : "꺼진 레드스톤 횃불", blockID : 75 },
	{ name : "켜진 레드스톤 횃불", blockID : 76 },
	{ name : "단추", blockID : 77 },
	{ name : "눈", blockID : 78 },
	{ name : "사탕수수", blockID : 83 },
	{ name : "케이크", blockID : 92 },
	{ name : "꺼진 레드스톤 중계기", blockID : 93 },
	{ name : "켜진 레드스톤 중계기", blockID : 94 },
	{ name : "다락문", blockID : 96 },
	{ name : "호박줄기", blockID : 104 },
	{ name : "수박줄기", blockID : 105 },
	{ name : "덩굴", blockID : 106 },
	{ name : "연꽃", blockID : 111 },
	{ name : "철사덫 갈고리", blockID : 131 },
	{ name : "철사덫", blockID : 132 },
	{ name : "당근", blockID : 141 },
	{ name : "감자", blockID : 142 },
	{ name : "버튼", blockID : 143 },
	{ name : "머리", blockID : 144 },
	{ name : "꺼진 레드스톤 비교기", blockID : 149 },
	{ name : "켜진 레드스톤 비교기", blockID : 150 },
	{ name : "철 다락문", blockID : 167 },
	{ name : "카페트", blockID : 171 },
	{ name : "해바라기", blockID : 175 },
	{ name : "사탕무 뿌리", blockID : 244 }
];

/**
 * 특정 좌표의 블럭이 제한되어 있는지 확인합니다
 */
SM.Entity.isBannedBlock = function (x, y, z) {
	var block = getTile(x, y, z);
	for (var b in SM.Entity.BannedBlockList)
		if (block == SM.Entity.BannedBlockList[b]["blockID"])
			return true;
			
	return false;
};

/**
 * 엔티티가 벽타기에 적합한지 여부를 확인합니다
 */
SM.Entity.isAbleToClimb = function (ent, y) {
	var X = Math.floor(sin * 0.5 * pcos + Entity.getX(ent));
	var Y = Entity.getY(ent) + y;
	var Z = Math.floor(cos * 0.5 * pcos + Entity.getZ(ent));
	
	if (getTile(X, Y, Z) != 0 && SM.Entity.isBannedBlock(X, Y, Z) == false)
		return true;
	else
		return false;
};

/* ModPE Functions */
function newLevel () {
	SM.LangWindow = new SM.GUI.SelectLangWindow();
	SM.LangWindow.show();
};

function leaveGame () {
	SM.GUI.destroy();
	
	SM.Active = false;
};

function modTick () {
	yaw = getYaw();
	pitch = getPitch();
	sin = - Math.sin(yaw / 180 * Math.PI);
	cos = Math.cos(yaw / 180 * Math.PI);
	pcos = Math.cos(pitch / 180 * Math.PI);
	pe = Player.getEntity();
	px = Player.getX();
	py = Player.getY();
	pz = Player.getZ();
	
	if (SM.Active) {
		SM.Mode.Run();
		SM.Control.Run();
		
		if (SM.GUI.Control.Count > 0) {
			SM.GUI.Control.Count --;
		}
		if (SM.GUI.Control.Count == 0) {
			SM.GUI.Control.TouchCount = 0;
		}
		if (SM.GUI.Control.onTouchCount > 0) {
			SM.GUI.Control.onTouchCount --;
		}
		if (SM.GUI.Control.onTouchCount == 1) {
			SM.GUI.Control.onTouch = false;
			SM.GUI.Control.release = true;
		}
		if (SM.GUI.Control.onTouchCount == 0) {
			SM.GUI.Control.release = false;
		}
		
		if (SM.UseSmartMoving) {
			if (SM.Mode.isClimbing) {
				setVelY(pe, 0.04);
			}
		
			if (getTile(px, py - 0.3, pz) == 9 
				|| getTile(px, py - 0.3, pz) == 11) {
				SM.Mode.inLiquid = true;
			} else {
				SM.Mode.inLiquid = false;
			}
	
			if (SM.Control.Use.Swim && SM.Mode.inLiquid) {
				if (SM.Entity.isAbleToClimb(pe, -1) == false) {
					if (getTile(px, py - 0.2, pz) == 0) {
						setVelY(pe, 0);
						SM.Mode.isSwimming = true;
					} else {
						if (SM.Mode.Drown == false)
							setVelY(pe, 0.03);
					}
				} else {
					SM.Mode.isSwimming = false;
				}
			} else {
				SM.Mode.isSwimming = false;
			}
		
			if (SM.Mode.Drown) {
				setVelY(pe, - 0.05);
			}
		}
	}
};
