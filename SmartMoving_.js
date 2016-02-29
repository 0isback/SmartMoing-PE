/*
*
* @author PlanP, KD
* @modify 0isback
* @since 08.03.2015
*
* 『 For A "PC Moving" IN PE 』
*
* Edited IN PC : EditPlus
* Edited IN MOBILE : DroidEdit
*
* UPDATE will be CONTINUED
*
*/

const bl = net.zhuoweizhang.mcpelauncher;
var root = android.os.Environment.getExternalStorageDirectory();
var dataFolder = new java.io.File(root, "games/com.mojang/minecraftpe/SmartMoving");

const Button = android.widget.Button;
const ToggleButton = android.widget.ToggleButton;
const TextView = android.widget.TextView;
const ImageView = android.widget.ImageView;
const Toast = android.widget.Toast;
const LinearLayout = android.widget.LinearLayout;
const FrameLayout = android.widget.FrameLayout;
const PopupWindow = android.widget.PopupWindow;
const ScrollView = android.widget.ScrollView;
const HorizontalScrollView = android.widget.HorizontalScrollView;

//widget
const GONE = android.view.View.GONE;
const VISIBLE = android.view.View.VISIBLE;
const OnTouchListener = android.view.View.OnTouchListener;
const OnClickListener = android.view.View.OnClickListener;
const MotionEvent = android.view.MotionEvent;
const Gravity = android.view.Gravity;

//View
const AlertDialog = android.app.AlertDialog;
const Intent = android.content.Intent;
const Uri = android.net.Uri;

//app / content / net
const Bitmap = android.graphics.Bitmap;
const Canvas = android.graphics.Canvas;
const Paint = android.graphics.Paint;
const Drawable = android.graphics.drawable.Drawaable;
const BitmapDrawable = android.graphics.drawable.BitmapDrawable;
const ColorDrawable = android.graphics.drawable.ColorDrawable;
const Typeface = android.graphics.Typeface;
const Color = android.graphics.Color;
const BitmapFactory = android.graphics.BitmapFactory;

//Graphics
const File = java.io.File;
const BufferedInputStream = java.io.BufferedInputStream;
const FileInputStream = java.io.FileInputStream;
const InputStream = java.io.InputStream;

//file
const BufferedImage = java.awt.image.BufferedImage;

var respawn = false;
var respawnDelay = 0;
var climbing = false;
var climbDelay = 0;
var crawling = false;
var downAct = false;

 /**
  * World를 클릭하면 최초 한번 호출되는 콜백 메소드입니다.
  */
 function selectLevelHook ()
 {
     MC.ctx.runOnUiThread (new java.lang.Runnable (
    {
        run : function ()
        {
            try
            {
                if((SM.World++) == 0)
                    SM.init();
            }
            catch (e)
            {
                MC.errorAlert(e);
            }
        }
    }));
 }
 
/**
 * World에 접속하였을때 호출되는 ModPE에서 기본 제공하는 콜벡 메서드입니다.
 */
function newLevel ()
{
    MC.ctx.runOnUiThread (new java.lang.Runnable (
    {
        run : function ()
        {
            try
            {
                SM.GUI.init();
            }
            catch (e)
            {
                MC.errorAlert(e);
            }
        }
    }));
}

/**
 * World에 접속중 1초에 20번 호출되는 ModPE에서 기본 제공하는 콜벡 메서드입니다.
 */
function modTick ()
{
    MC.ctx.runOnUiThread (new java.lang.Runnable (
    {
        run : function ()
        {
            try
            {
                if (SM.Mode.Run)
                    SM.run();
            }
            catch (e)
            {
                MC.errorAlert(e);
            }
        }
    }));
    if (respawn) {
	    respawnDelay++;
        if (respawnDelay==10) {
        	rpx=Player.getX();
        	rpy=Player.getY();
        	rpz=Player.getZ();
        	}
        	else if (respawnDelay>10) {
	           if (rpx!=Player.getX()||rpy!=Player.getY()|| rpz!=Player.getZ()) {
	       	    MC.ctx.runOnUiThread (new java.lang.Runnable ( {
	       		       run : function () {
                             try {
                 	            SM.Object.HealthBar.show();
                 	            SM.Object.NoHealthBar.show();
                 	            SM.Object.HungerBar.show();
                 	            SM.Object.NoHungerBar.show();
                             }
                             catch (e) {
                             MC.errorAlert(e);
                             }
                         }
                     }));
                     respawn = false;
                     respawnDelay=0;
   	         }
	      }
    }
    
    if (climbing)
    {
    Entity.setVelY(Player.getEntity(),0.04);
    }
    
    if (downAct)
    {
    Entity.setPositionRelative(
    Player.getEntity(),0,-1,0);
    Entity.setPositionRelative(
    Player.getEntity(),0,1.1,0);
    downAct = false;
    }
}

function deathHook (a,v)
{
   if (MC.equalEnt(v,getPlayerEnt())) {
     MC.ctx.runOnUiThread (new java.lang.Runnable ( {
         run : function () {
             try {
             SM.Object.HealthBar.destroy();
             SM.Object.NoHealthBar.destroy();
             SM.Object.HungerBar.destroy();
             SM.Object.NoHungerBar.destroy();
             //destroy healthbar when player die
             }
             catch (e) {
                MC.errorAlert(e);
             }
         }
     }));
     respawn = true;
	  }
}

/**
 * World의 접속이 종료될때 호출되는 ModPE에서 기본 제공하는 콜벡 메서드 입니다.
 */
function leaveGame ()
{
    MC.ctx.runOnUiThread (new java.lang.Runnable (
    {
        run : function ()
        {
            try
            {
                SM.GUI.destroy();
                SM.Object.HealthBar.destroy();
                SM.Object.NoHealthBar.destroy();
                SM.Object.HungerBar.destroy();
                SM.Object.NoHungerBar.destroy();
            }
            catch (e) {
                MC.errorAlert(e);
            }
        }
    }));
}

/**
 * Smart Moving의 구조체 입니다.
 */
var SM = {
    World : 0,
    
    Window :
    {
        MultiButton : null,
        OptionBotton : null,
        Cancelbutton : null
    },

    Object :
    {
        EnergyBar : null,
        JumpBar : null,
        ChargingJumpBar : null,
        HealthBar : null,
        NoHealthBar : null,
        HungerBar : null,
        NoHungerBar : null,
        Option : null
    },

    Mode :
    {
        isJump : false,
        isSprint : false,
        isDive : false,
        ChangeControl : false,
        UseTip : false,
        Run : true
    },
    
    Button :
    {
        Multi :
        {
            Normal : false,
            Up : false,
            Down : false,
			
			Count : 4,
			TouchCount : 0,
			
			isDouble : false,
			isCheck : false
        }
    },

    /*
     * Smart Moving의 초기화를 위해서 제공하는 콜벡 메서드입니다.
     * Script가 적용 되었을때 호출 됩니다.
     */ 
    init : function ()
    {
        SM.Object.ChargingJumpBar = SM.GUI.ChargingJumpBar();
        SM.Object.HealthBar = SM.GUI.HealthBar();
        SM.Object.NoHealthBar = SM.GUI.NoHealthBar();
        SM.Object.HungerBar = SM.GUI.HungerBar();
        SM.Object.NoHungerBar = SM.GUI.NoHungerBar();
        SM.Object.EnergyBar = SM.GUI.EnergyBar();
        SM.Object.JumpBar = SM.GUI.JumpBar();
        //imagebar
        SM.Object.Option = SM.GUI.Option();
        SM.Object.Option.init();
    },

    /**
     * World에 접속중 1초에 20번 호출되는
     * Smart Moving에서 제공하는 콜벡 메서드입니다.
     */
    run : function ()
    {
        SM.GUI.run();
        
        px=Player.getX();
        py=Player.getY();
        pz=Player.getZ();
        pe=Player.getEntity();
        yaw=(getYaw());
        pitch=(getPitch());
        sin=-Math.sin(yaw/180*Math.PI);
        cos=Math.cos(yaw/180*Math.PI);
        tan=-Math.sin(pitch/180*Math.PI);
        pcos=Math.cos(pitch/180*Math.PI);
        
        if (crawling)
        {
        Moving.crawl();
        SM.Window.CancelButton.showAtLocation(MC.ctx.getWindow().getDecorView(),
        Gravity.RIGHT | Gravity.BOTTOM,
        MC.dp(7), MC.dp(20));
        }
        else
        {
        SM.Window.CancelButton.dismiss();
        }
			            
        //Mode
        if (SM.Mode.isJump)
        {
            if (SM.Object.JumpBar.getValue() < 20)
                SM.Object.JumpBar.setValue(SM.Object.JumpBar.getValue()+1);
                //bar
                
                if (SM.Object.JumpBar.getValue() == 20)
                {
                  if (SM.Mode.UseTip)
                  {
                  ModPE.showTipMessage("\nJumpAble");
                  }
                }
                //active
        }
        else if (SM.Object.JumpBar.getValue() > 0)
           SM.Object.JumpBar.setValue(0);
           
           
        if (SM.Mode.isSprint)
        {
            if (SM.Object.EnergyBar.getValue() < 20)
                SM.Object.EnergyBar.setValue(SM.Object.EnergyBar.getValue()+1);
                //bar
                
                xx = -1*Math.sin(yaw*Math.PI/180);
                zz = Math.cos(yaw*Math.PI/180);
                setVelX(pe,xx*0.3);
                setVelZ(pe,zz*0.3);
                //active
        }
        else if (SM.Object.EnergyBar.getValue() > 0)
           SM.Object.EnergyBar.setValue(0);
           
           
        if (SM.Mode.isDive)
        {
            if (SM.Object.ChargingJumpBar.getValue() < 20)
                SM.Object.ChargingJumpBar.setValue(SM.Object.ChargingJumpBar.getValue()+1);
                //bar
                
        }
        else if (SM.Object.ChargingJumpBar.getValue() > 0)
           SM.Object.ChargingJumpBar.setValue(0);
           
       //Button
				  if (!SM.Button.Multi.isCheck)
  			  {
  			      if (!SM.Button.Multi.isDouble)
  			      {
  			      SM.Mode.isDive = false;
  			      climbing = false;
  			          
  			          if (SM.Button.Multi.Normal)
  			          {
  			            if (Entity.isSneaking(pe) && Moving.onLand(pe))
  			            {
  			            SM.Mode.isJump = true;
  			            SM.Button.Multi.isCheck = true;
  			            }
  			            else
  			            SM.Mode.isJump = false;
  			            //jump
  			            if (!Entity.isSneaking(pe))
  			            {
  			                if (Moving.getEntitySpeed(pe) > 0.14 && Moving.onLand(pe))
  			                {
  			                SM.Mode.isSprint = true;
  			                  if (SM.Mode.UseTip)
  			                  {
  			                  ModPE.showTipMessage("\nisSprinting");
  			                  }
  			                SM.Button.Multi.isCheck = true;
  			                }
  			                else
  			                SM.Mode.isSprint = false;
  			            }
  			            SM.Button.Multi.isCheck = true;
  			          }
  			          
  			          else if (!SM.Button.Multi.Normal)
  			          {
  			          SM.Button.Multi.isCheck = true;
  			          SM.Mode.isSprint = false;
  			          SM.Mode.isJump = false;
  			            
  			            if (Entity.isSneaking(pe) == true)
  			            {
  			            setVelY(Player.getEntity(),
  			            SM.Object.JumpBar.getValue() * 0.04);
  			            }
  			          }
  			      }//!Double
  			      else if (SM.Button.Multi.isDouble)
  			      {
  			      SM.Mode.isSprint = false;

  			          if (SM.Button.Multi.Up)
  			          {
  			             if (crawling == false)
  			             {
  			              if (Moving.climbCheck(0,2,0) == false)
  			              {
  			                  if (Moving.climbCheck(0,1,0) 
  			                  || Moving.climbCheck(0,0,0) 
  			                  || Moving.climbCheck(0,-1,0))
  			                  {
  			                  climbing = true;
  			                  }
  			              }
  			              if (Moving.climbCheck(0,0,0) == false 
  			              && Moving.climbCheck(0,-1,0) == false 
  			              && Moving.climbCheck(0,-2,0) == false 
  			              && climbing == true)
  			              {
  			              climbing = false;
  			              Entity.setVelX(pe,sin*0.2);
  			              Entity.setVelZ(pe,cos*0.2);
  			              }
  			             
  			             if (Moving.getEntitySpeed(pe) > 0.14 && Moving.onLand(pe))
			      	    	  {
			      	    	  SM.Mode.isDive = true;
			      	    	  }
			      	    	  else
			      	    	  SM.Mode.isDive = false;
			      	    	  
			      	    	  if (SM.Object.ChargingJumpBar.getValue() >= 10)
			      	    	  {
			      	    	      if (!(Level.getTile(Math.floor(px)+sin*0.5,Math.floor(py)-0.72-1,Math.floor(pz)+cos*0.5) > 0))
			      	    	      {
			      	    	          if (Moving.getEntitySpeed(pe) > 0.14)
			      	    	          {
			      	    	          Moving.dive();
			      	    	          Entity.setCollisionSize(pe,-1,1.72);
			      	    	          Entity.setPositionRelative(pe,0,-1.2,0);
			      	    	          Entity.setVelY(pe,0.3);
			      	    	          Entity.setVelX(pe,sin*SM.Object.ChargingJumpBar.getValue()*0.04+Entity.getVelX(getPlayerEnt()));
			      	    	          Entity.setVelZ(pe,cos*SM.Object.ChargingJumpBar.getValue()*0.04+Entity.getVelZ(getPlayerEnt()));
			      	    	          			      	    	          Moving.Mode="Slide";
			      	    	          SM.Object.ChargingJumpBar.setValue(0);
			      	    	            if (SM.Mode.UseTip)
			      	    	            {
			      	    	            ModPE.showTipMessage("\nisDiving");
			      	    	            }
			      	    	          }
			      	    	      }
			      	    	  }
			      	    	 }
			      	    	 else if (crawling == true)
			      	    	 {
			      	    	     if (!Moving.isLookingBlock(pe,1) 
			      	    	     && climbing == false)
			      	    	     {
			      	    	         if (climbDelay == 0)
			      	    	         {
			      	    	         Entity.setVelX(pe,sin*0.08);
			      	    	         Entity.setVelZ(pe,cos*0.08);
			      	    	         }
			      	    	         else
			      	    	         {
			      	    	         Entity.setVelX(pe,sin*0.15);
			      	    	         Entity.setVelZ(pe,cos*0.15);
			      	    	         }
			      	    	     }
			      	    	     
			      	    	     if (Moving.isLookingBlock(pe,1) 
			      	    	     && Moving.climbCheck(0,0,0) == true
			      	    	     && Moving.climbCheck(0,1,0) == false 
			      	    	     && getTile(Math.floor(px),Math.floor(py)+1,Math.floor(pz)) == 0)
			      	    	     {
			      	    	     climbing = true;
			      	    	     climbDelay++
			      	    	     Entity.setVelX(pe,0);
			      	    	     Entity.setVelZ(pe,0);
			      	    	     }
			      	    	     
			      	    	     if (Moving.climbCheck(0,-1,0) == false 
			      	    	     && getTile(Math.floor(px),Math.floor(py)-1,Math.floor(pz)) == 0 
			      	    	     && climbing == true)
			      	    	     {
			      	    	     climbing = false;
			      	    	     }
			      	    	 }
			      	    }//UP
			      	    else
			      	    {
			      	    SM.Object.ChargingJumpBar.setValue(0);
			      	    SM.Mode.isDive = false;
			      	    climbing = false;
			      	    }
			      	    
			      	    if (SM.Button.Multi.Down)
			      	    {
			      	        if (!Entity.isSneaking(pe) 
			      	        && Moving.Check(Math.floor(px),Math.floor(py)-1,Math.floor(pz)) == false 
			      	        && crawling == false)
			      	        {
			      	        
			      	        crawling = true;
			      	        downAct = true;
			      	        }
			      	    }//Down
			      	    
			      	}//Double
			   }
    },

    GUI :
    {
        /**
         * Smart Moving의 GUI의 초기화를 위하여 제공하는 콜백 메서드입니다.
         */
        init : function ()
        {
            if (SM.Mode.Run)
            {
                SM.Object.HealthBar.show();
                SM.Object.NoHealthBar.show();
                SM.Object.HungerBar.show();
                SM.Object.NoHungerBar.show();
                SM.Object.EnergyBar.show();
                SM.Object.JumpBar.show();
                SM.Object.ChargingJumpBar.show();

                SM.Window.MultiButton = SM.GUI.MultiButton();
                SM.Window.CancelButton = SM.GUI.CancelButton();
            }
            
            SM.Window.OptionBotton = SM.GUI.OptionBotton();
            
        },
        
        /**
         * Smart Moving의 GUI의 변경을 위하여 제공하는 콜백 메서드입니다.
         */
        run : function ()
        {
            if (Level.getGameMode()==0) {
            SM.Object.HealthBar.setValue(Entity.getHealth(getPlayerEnt()));
            SM.Object.NoHealthBar.setValue(20-SM.Object.HealthBar.getValue());
            SM.Object.HungerBar.setValue(Player.getHunger(getPlayerEnt()));
            SM.Object.NoHungerBar.setValue(20-SM.Object.HungerBar.getValue());
            }
            else {
            SM.Object.HealthBar.setValue(0);
            SM.Object.NoHealthBar.setValue(0);
            SM.Object.HungerBar.setValue(0);
            SM.Object.NoHungerBar.setValue(0);
            }
            if (SM.Button.Multi.Count > 0)
                SM.Button.Multi.Count--;
            if (SM.Button.Multi.Count == 0)
                SM.Button.Multi.TouchCount = 0;
        },
        
        /**
         * Smart Moving의 GUI의 파괴을 위하여 제공하는 콜백 메서드입니다.
         */
        destroy : function ()
        {
            if (SM.Window.OptionBotton != null)
            {
                SM.Window.OptionBotton.dismiss();
                SM.Window.OptionBotton = null;
            }
            if (SM.Window.MultiButton != null)
            {
                SM.Window.MultiButton.dismiss();
                SM.Window.MultiButton = null;
            }
            if (SM.Window.CancelButton != null)
            {
                SM.Window.CancelButton.dismiss();
                SM.Window.CancelButton = null;
            }
            SM.Object.EnergyBar.destroy();
            SM.Object.JumpBar.destroy();
        },
        
        MultiButton : function ()
        {
            var window = new PopupWindow(MC.ctx);
            
            var layout = new LinearLayout(MC.ctx);
            
            var button = new MC.GUIButton(MC.Bitmap.GUIButton.JumpDrawable());
            
            var buttonUp = new MC.GUIButton(MC.Bitmap.GUIButton.FlyUpDrawable());
            var buttonDown = new MC.GUIButton(MC.Bitmap.GUIButton.FlyDownDrawable());
            
            var m_ml1 = new LinearLayout(MC.ctx);
            var m_ml2 = new LinearLayout(MC.ctx);
            
            button.setOnTouchListener (new OnTouchListener (
            {
                onTouch : function (view, event)
                {
                    if (event.getAction() == MotionEvent.ACTION_DOWN)
                    {
                        view.setImageBitmap(MC.Bitmap.LayerBitmap());
                        
                        SM.Button.Multi.Normal = true;
						SM.Button.Multi.isCheck = false;
                        
                        SM.Button.Multi.TouchCount++;
                                         
                        if(SM.Button.Multi.TouchCount >= 2)
                        {
                            buttonUp.setVisibility(VISIBLE);
                            buttonDown.setVisibility(VISIBLE);
                            
                            if (crawling)
                            {
                            buttonDown.setVisibility(GONE);
                            }
                            
                            SM.Button.Multi.isDouble = true;
                        }
                        else
                            SM.Button.Multi.Count = 4;
                    }
                    else if (event.getAction() == MotionEvent.ACTION_MOVE)
                    {
                        if (SM.Button.Multi.isDouble)
                        {
                            var m_coordY = event.getRawY();
                            
                            if ((MC.HEIGHT - MC.dp(55)) < m_coordY)
                            {
                                SM.Button.Multi.Normal = false;
                                SM.Button.Multi.Up = false;
                                SM.Button.Multi.Down = true;
                            }
                            else if ((MC.HEIGHT - MC.dp(105)) > m_coordY)
                            {
                                SM.Button.Multi.Normal = false;
                                SM.Button.Multi.Up = true;
                                SM.Button.Multi.Down = false;
                            }
                            else
                            {
                                SM.Button.Multi.Normal = true;
                                SM.Button.Multi.Up = false;
                                SM.Button.Multi.Down = false;
                            }
                        }
                    }
                    else if (event.getAction() == MotionEvent.ACTION_UP)
                    {
                        SM.Button.Multi.isDouble = false;
						SM.Button.Multi.isCheck = false;
                        
                        SM.Button.Multi.Normal = false;
                        SM.Button.Multi.Up = false;
                        SM.Button.Multi.Down = false;
                        
                        view.setImageBitmap(null);
                                         
                        buttonUp.setVisibility(GONE);
                        buttonDown.setVisibility(GONE);
                    }
                    return false;
                }
            }));
            buttonUp.setVisibility(GONE);
            buttonDown.setVisibility(GONE);
            
            m_ml1.setGravity(Gravity.TOP | Gravity.CENTER);  
            m_ml2.setGravity(Gravity.BOTTOM | Gravity.CENTER);  
            
            m_ml1.addView(buttonUp, MC.dp(35), MC.dp(35));
            m_ml2.addView(buttonDown, MC.dp(35), MC.dp(35));
            
            layout.setOrientation(1);
            layout.setGravity(Gravity.CENTER | Gravity.CENTER);  
            
            layout.addView(m_ml1, MC.dp(40), MC.dp(50));
            layout.addView(button, MC.dp(40), MC.dp(40));
            layout.addView(m_ml2, MC.dp(40), MC.dp(50));
            
            window.setContentView(layout);
            window.setBackgroundDrawable(null);
            window.setWidth(MC.dp(40));
            window.setHeight(MC.dp(140));
            window.showAtLocation(MC.ctx.getWindow().getDecorView(),
                                  Gravity.RIGHT | Gravity.BOTTOM,
                                  MC.dp(5), MC.dp(20));

            return window;
        },
        
        HealthBar : function () 
        {
            var bar = new MC.ImageBar(SM.GUI.Image.FullHeart(), SM.GUI.Image.HalfHeart(),
                                      -MC.dp(105), MC.dp(60), false);
            bar.setValue(0);

            return bar;
        },
        
        NoHealthBar : function () 
        {
            var bar = new MC.ImageBar(SM.GUI.Image.NoHeart(), SM.GUI.Image.HalfHeart(),
                                      -MC.dp(105), MC.dp(60), true);
            bar.setValue(0);

            return bar;
        },
        
        HungerBar : function () 
        {
            var bar = new MC.ImageBar(SM.GUI.Image.FullHunger(), SM.GUI.Image.HalfHunger(),
                                      MC.dp(105), MC.dp(60), true);
            bar.setValue(0);

            return bar;
        },
        
        NoHungerBar : function () 
        {
            var bar = new MC.ImageBar(SM.GUI.Image.NoHunger(), SM.GUI.Image.HalfHunger(),
                                      MC.dp(105), MC.dp(60), false);
            bar.setValue(0);

            return bar;
        },
        
        EnergyBar : function ()
        {
            var bar = new MC.ImageBar(SM.GUI.Image.FullEnergy(), SM.GUI.Image.HalfEnergy(),
                                      MC.dp(105), MC.dp(78), true);
            bar.setValue(0);

            return bar;
        },

        JumpBar : function () 
        {
            var bar = new MC.ImageBar(SM.GUI.Image.FullJump(), SM.GUI.Image.HalfJump(),
                                      -MC.dp(105), MC.dp(78), false);
            bar.setValue(0);

            return bar;
        },
        
        ChargingJumpBar : function () 
        {
            var bar = new MC.ImageBar(SM.GUI.Image.FullJump(), SM.GUI.Image.HalfJump(),
                                      -MC.dp(105), MC.dp(78), false);
            bar.setValue(0);

            return bar;
        },
        
        CancelButton : function ()
        {
            var window = new PopupWindow(MC.ctx);

            var button = new MC.XButton(MC.ctx);

            button.setAlpha(0.5);
            
            button.setOnClickListener (new OnClickListener (
            {
                onClick: function (view)
                {
                    try
                    {
                        Moving.CancelAct();
                        Entity.addEffect(getPlayerEnt(),
                        MobEffect.damageResistance, 0.2*20, 1000*1000, false, true);
                    }
                    catch (e)
                    {
                        MC.errorAlert(e);
                    }
                }
            }));

         window.setContentView(button);
         window.setBackgroundDrawable(null);
         window.setWidth(MC.fixdp(35));
         window.setHeight(MC.fixdp(35));

            return window;
        },
        
        OptionBotton : function ()
        {
            var window = new PopupWindow(MC.ctx);

            var button = new MC.ImageButton(MC.Bitmap.Option.Bitmap());

            button.setAlpha(0.5);

            button.setImageBitmap(MC.onSizePatch(MC.Bitmap.Option.Bitmap(), 16));

            button.setOnClickListener (new OnClickListener (
            {
                onClick: function (view)
                {
                    try
                    {
                        SM.Object.Option.show();
                    }
                    catch (e)
                    {
                        MC.errorAlert(e);
                    }
                }
            }));

         window.setContentView(button);
         window.setBackgroundDrawable(null);
         window.setWidth(MC.fixdp(35));
         window.setHeight(MC.fixdp(35));
         window.showAtLocation(MC.ctx.getWindow().getDecorView(),
                               Gravity.RIGHT | Gravity.TOP,
                               MC.fixdp(37), MC.fixdp(2));

            return window;
        },

        Option : function ()
        {
            var option = new MC.Option();

            option.setTitle("설정");

            option.addSlot(MC.Bitmap.Option.NormalBitmap());
            
            option.addText("게임");
            option.addSwitchOn("스마트무빙 사용", "enable_sm", "SM.Mode.Run", "SM.GUI.destroy(); SM.GUI.init();", "SM.GUI.destroy(); SM.GUI.init();");
            option.addSwitchOff("도움말 사용", "use_tip", "SM.Mode.UseTip", "", "");
            
            option.addSlot(MC.Bitmap.Option.GameBitmap());
            
            option.addText("컨트롤");
            option.addSwitchOff("컨트롤 방식 변경 (추가예정)", "change_control", "SM.Mode.ChangeControl", "", "");
            
            option.end();
            
            option.init();
            
            return option;
        },

        Image :
        {
            FullHeart : function ()
            {
                //Color
                var L = Color.parseColor("#FF0000");
                var w = Color.parseColor("#FFFFFF");
                var a = Color.parseColor("#000000");

                //9×9 bitmap 
                var color = [0, 0, a, a, 0, a, a, 0, 0,
                             0, a, L, L, a, L, L, a, 0,
                             a, L, w, L, L, L, L, L, a,
                             a, L, L, L, L, L, L, L, a,
                             a, L, L, L, L, L, L, L, a,
                             0, a, L, L, L, L, L, a, 0,
                             0, 0, a, L, L, L, a, 0, 0,
                             0, 0, 0, a, L, a, 0, 0, 0,
                             0, 0, 0, 0, a, 0, 0, 0, 0];

                var bit = Bitmap.createBitmap(9, 9, Bitmap.Config.ARGB_8888);
                bit.setPixels(color, 0, 9, 0, 0, 9, 9);

                var bitmap = Bitmap.createScaledBitmap(bit, MC.dp(32), MC.dp(32), false);
                return bitmap;
            },
            
            HalfHeart : function ()
            {
                //Color
                var L = Color.parseColor("#FF0000");
                var w = Color.parseColor("#FFFFFF");
                var a = Color.parseColor("#000000");

                //9×9 bitmap 
                var color = [0, 0, a, a, 0, a, a, 0, 0,
                             0, a, L, L, a, a, a, a, 0,
                             a, L, w, L, L, a, a, a, a,
                             a, L, L, L, L, a, a, a, a,
                             a, L, L, L, L, a, a, a, a,
                             0, a, L, L, L, a, a, a, 0,
                             0, 0, a, L, L, a, a, 0, 0,
                             0, 0, 0, a, L, a, 0, 0, 0,
                             0, 0, 0, 0, a, 0, 0, 0, 0];

                var bit = Bitmap.createBitmap(9, 9, Bitmap.Config.ARGB_8888);
                bit.setPixels(color, 0, 9, 0, 0, 9, 9);

                var bitmap = Bitmap.createScaledBitmap(bit, MC.dp(32), MC.dp(32), false);
                return bitmap;
            },
            
            NoHeart : function ()
            {
                //Color
                
                var a = Color.parseColor("#000000");

                //9×9 bitmap
                var color = [0, 0, a, a, 0, a, a, 0, 0,
                             0, a, a, a, a, a, a, a, 0,
                             a, a, a, a, a, a, a, a, a,
                             a, a, a, a, a, a, a, a, a,
                             a, a, a, a, a, a, a, a, a,
                             0, a, a, a, a, a, a, a, 0,
                             0, 0, a, a, a, a, a, 0, 0,
                             0, 0, 0, a, a, a, 0, 0, 0,
                             0, 0, 0, 0, a, 0, 0, 0, 0];
                
                var bit = Bitmap.createBitmap(9, 9, Bitmap.Config.ARGB_8888);
                bit.setPixels(color, 0, 9, 0, 0, 9, 9);
                
                var bitmap = Bitmap.createScaledBitmap(bit, MC.dp(32), MC.dp(32), false);
                return bitmap;
            },
            
            FullHunger : function ()
            {
                //Color
                var L = Color.parseColor("#FF0000");//red
                var w = Color.parseColor("#FFFFFF");//white
                var a = Color.parseColor("#8B0000");//rred
                var D = Color.parseColor("#CD853F");//brown
                var U = Color.parseColor("#D2691E");//bb
                var T = Color.parseColor("#A0522D");//bbb
                var Q = Color.parseColor("#8B4513");//bbbb
                var A = Color.parseColor("#000000");//black

                //9×9 bitmap 
                var color = [0, 0, A, A, 0, 0, 0, 0, 0,
                             0, A, L, a, A, 0, 0, 0, 0,
                             A, L, w, L, D, A, 0, 0, 0,
                             A, a, L, D, U, D, A, 0, 0,
                             0, A, Q, T, U, U, A, 0, 0,
                             0, 0, A, Q, T, T, A, 0, 0,
                             0, 0, 0, A, A, A, w, A, 0,
                             0, 0, 0, 0, 0, 0, A, w, A,
                             0, 0, 0, 0, 0, 0, 0, A, A]

                
                var bit = Bitmap.createBitmap(9, 9, Bitmap.Config.ARGB_8888);
                bit.setPixels(color, 0, 9, 0, 0, 9, 9);

                var bitmap = Bitmap.createScaledBitmap(bit, MC.dp(32), MC.dp(32), false);
                return bitmap;
            },
            
            HalfHunger : function ()
            {
                //Color
                var L = Color.parseColor("#FF0000");//red
                var w = Color.parseColor("#FFFFFF");//white
                var a = Color.parseColor("#8B0000");//rred
                var D = Color.parseColor("#CD853F");//brown
                var U = Color.parseColor("#D2691E");//bb
                var T = Color.parseColor("#A0522D");//bbb
                var Q = Color.parseColor("#8B4513");//bbbb
                var A = Color.parseColor("#000000");//black


                //9×9 bitmap 
                var color = [0, 0, A, A, 0, 0, 0, 0, 0,
                             0, A, A, a, A, 0, 0, 0, 0,
                             A, A, w, L, a, A, 0, 0, 0,
                             A, A, A, w, L, D, A, 0, 0,
                             0, A, A, a, a, U, A, 0, 0,
                             0, 0, A, A, Q, T, A, 0, 0,
                             0, 0, 0, A, A, A, w, A, 0,
                             0, 0, 0, 0, 0, 0, A, w, A,
                             0, 0, 0, 0, 0, 0, 0, A, A];

                var bit = Bitmap.createBitmap(9, 9, Bitmap.Config.ARGB_8888);
                bit.setPixels(color, 0, 9, 0, 0, 9, 9);

                var bitmap = Bitmap.createScaledBitmap(bit, MC.dp(32), MC.dp(32), false);
                return bitmap;
            },
            
            NoHunger : function ()
            {
                //Color
                var A = Color.parseColor("#000000");

                //9×9 bitmap 
                var color = [0, 0, A, A, 0, 0, 0, 0, 0,
                             0, A, A, A, A, 0, 0, 0, 0,
                             A, A, A, A, A, A, 0, 0, 0,
                             A, A, A, A, A, A, A, 0, 0,
                             0, A, A, A, A, A, A, 0, 0,
                             0, 0, A, A, A, A, A, 0, 0,
                             0, 0, 0, A, A, A, A, A, 0,
                             0, 0, 0, 0, 0, 0, A, A, A,
                             0, 0, 0, 0, 0, 0, 0, A, A];

                var bit = Bitmap.createBitmap(9, 9, Bitmap.Config.ARGB_8888);
                bit.setPixels(color, 0, 9, 0, 0, 9, 9);

                var bitmap = Bitmap.createScaledBitmap(bit, MC.dp(32), MC.dp(32), false);
                return bitmap;
            },
            
            FullEnergy : function ()
            {
                //Color
                var Y = Color.parseColor("#FFFFFF00");

                //9×9 bitmap 
                var color = [0, 0, 0, 0, 0, Y, 0, 0, 0,
                             0, 0, 0, 0, Y, 0, 0, 0, 0,
                             0, 0, 0, Y, Y, 0, 0, 0, 0,
                             0, 0, Y, Y, 0, 0, 0, 0, 0,
                             0, 0, Y, Y, Y, Y, Y, 0, 0,
                             0, 0, 0, 0, 0, Y, Y, 0, 0,
                             0, 0, 0, 0, Y, Y, 0, 0, 0,
                             0, 0, 0, 0, Y, 0, 0, 0, 0,
                             0, 0, 0, Y, 0, 0, 0, 0, 0];

                var bit = Bitmap.createBitmap(9, 9, Bitmap.Config.ARGB_8888);
                bit.setPixels(color, 0, 9, 0, 0, 9, 9);

                var bitmap = Bitmap.createScaledBitmap(bit, MC.dp(32), MC.dp(32), false);
                return bitmap;
            },

            HalfEnergy : function ()
            {
                //Color
                var Y = Color.parseColor("#FFFFFF00");
                var W = Color.parseColor("#FFFFFFFF");

                //9×9 bitmap
                var color = [0, 0, 0, 0, 0, 0, 0, 0, 0,
                             0, W, 0, 0, 0, 0, 0, 0, 0,
                             0, 0, 0, 0, Y, 0, W, 0, 0,
                             0, 0, 0, Y, 0, 0, 0, 0, 0,
                             0, 0, 0, Y, Y, Y, 0, 0, 0,
                             0, 0, 0, 0, 0, Y, 0, 0, 0,
                             0, 0, W, 0, Y, 0, 0, 0, 0,
                             0, 0, 0, 0, 0, 0, 0, W, 0,
                             0, 0, 0, 0, 0, 0, 0, 0, 0];

                var bit = Bitmap.createBitmap(9, 9, Bitmap.Config.ARGB_8888);
                bit.setPixels(color, 0, 9, 0, 0, 9, 9);

                var bitmap = Bitmap.createScaledBitmap(bit, MC.dp(32), MC.dp(32), false);
                return bitmap;
            },

            FullJump : function ()
            {
                //Color
                var B = Color.parseColor("#FF1499FF");
                var b = Color.parseColor("#FF0526FF");
                var D = Color.parseColor("#FF000000");

                //9×9 bitmap
                var color = [0, 0, 0, 0, D, 0, 0, 0, 0,
                             0, 0, 0, D, B, D, 0, 0, 0,
                             0, 0, D, B, B, B, D, 0, 0,
                             0, D, B, B, B, B, B, D, 0,
                             D, b, b, B, B, B, b, b, D,
                             0, D, D, B, B, B, D, D, 0,
                             0, 0, D, B, B, B, D, 0, 0,
                             0, 0, D, b, b, b, D, 0, 0,
                             0, 0, 0, D, D, D, 0, 0, 0];

                var bit = Bitmap.createBitmap(9, 9, Bitmap.Config.ARGB_8888);
                bit.setPixels(color, 0, 9, 0, 0, 9, 9);

                var bitmap = Bitmap.createScaledBitmap(bit, MC.dp(32), MC.dp(32), false);
                return bitmap;
            },

            HalfJump : function ()
            {
                //Color
                var B = Color.parseColor("#FF1499FF");
                var b = Color.parseColor("#FF0526FF");
                var D = Color.parseColor("#FF000000");

                //9×9 bitmap
                var color = [0, 0, 0, 0, 0, 0, 0, 0, 0,
                             0, 0, 0, 0, D, 0, 0, 0, 0,
                             0, 0, 0, D, B, D, 0, 0, 0,
                             0, 0, D, B, B, B, D, 0, 0,
                             0, D, b, b, B, b, b, D, 0,
                             0, 0, 0, D, B, D, 0, 0, 0,
                             0, 0, 0, D, B, D, 0, 0, 0,
                             0, 0, 0, D, b, D, 0, 0, 0,
                             0, 0, 0, 0, D, 0, 0, 0, 0];

                var bit = Bitmap.createBitmap(9, 9, Bitmap.Config.ARGB_8888);
                bit.setPixels(color, 0, 9, 0, 0, 9, 9);

                var bitmap = Bitmap.createScaledBitmap(bit, MC.dp(32), MC.dp(32), false);
                return bitmap;
            }
        }
    }
};

/**
 * SmartMoving PE의 움직임 제공을 위한 구조체입니다.
 */
 var Moving =
 {
     Mode : null,
     
     Check : function (x,y,z)
     {
     try
      {
      var b=Level.getTile(x,y,z);
       if(b==144||b==28||b==37||b==69
           ||b==70||b==72||b==75||b==76
           ||b==77||b==131||b==143||b==6
           ||b==9||b==11||b==30||b==31
           ||b==27||b==37||b==38||b==39
           ||b==40||b==50||b==51||b==55
           ||b==59||b==63||b==64||b==65
           ||b==66||b==68||b==71||b==83
           ||b==104||b==105||b==106||b==111
           ||b==141||b==142||b==171||b==175
           ||b==244)
       {
       return true;
       }
       else
       return false;
      }catch(err){clientMessage(err);}
     },
     
     getEntitySpeed : function (entity)
     {
      return Math.sqrt(Entity.getVelX(entity)*Entity.getVelX(entity)+Entity.getVelZ(entity)*Entity.getVelZ(entity));
     },
     
     onLand : function (ent)
     {
          if (Entity.getVelY(ent) < -0.077
               && getTile(Math.floor(Entity.getX(ent)), Math.floor(Entity.getY(ent))-2, Math.floor(Entity.getZ(ent))) > 0)
          {
              return true;
          }
          else
          {
              return false;
          }
     },
     
     isLookingBlock : function (entity, distance)
     {
     yaw = Entity.getYaw(entity);
     pitch = Entity.getPitch(entity);
     if (pitch < 0) return false;
     //prevent floor
     sin = -Math.sin(yaw/180*Math.PI);
     cos = Math.cos(yaw/180*Math.PI);
     psin = -Math.sin(pitch/180*Math.PI);
     pcos = Math.cos(pitch/180*Math.PI);
     var isBlock = false;
     px = Entity.getX(entity);
     py = Entity.getY(entity);
     pz = Entity.getZ(entity);
     
     for (var i=0;i<distance;i+=0.5)
         if (Level.getTile(
         Math.floor(px+i*sin*pcos),
         Math.floor(py+i*psin),
         Math.floor(pz+i*cos*pcos)) > 0)
         {
         isBlock=true;
         return isBlock;
         }
     return isBlock;
     },
     
     climbCheck : function (cx, cy, cz)
     {
       try
       {
          if (getTile(Math.floor(sin*pcos+
          Entity.getX(getPlayerEnt())+cx,10),
          Math.floor(Entity.getY(getPlayerEnt())+cy,10),
          Math.floor(cos*pcos
          +Entity.getZ(getPlayerEnt())+cz,10)) != 0 
          && Moving.Check(Math.floor(sin*pcos+
          Entity.getX(getPlayerEnt())+cx,10),
          Math.floor(Entity.getY(getPlayerEnt())+cy,10),
          Math.floor(cos*pcos
          +Entity.getZ(getPlayerEnt())+cz,10)) == false)
          {
          return true;
          }
          else
          return false;
       }catch(err)
       {
       clientMessage(err);
       }
     },
     
     dive : function()
     {
     
     Moving.Mode = "Slide";
     pe=Player.getEntity();
     px=Player.getX();
     py=Player.getY();
     pz=Player.getZ();
     
     if(px<0){px--;}
     if(pz<0){pz--;}
     VelX=Entity.getVelX(pe)*4;
     VelZ=Entity.getVelZ(pe)*4;
 
     if (Level.getTile(px+VelX,py-0.72,pz+VelZ)>0 
     && Moving.Check(px+VelX,py-0.72,pz+VelZ) == false)
     {
     Entity.setPositionRelative(pe,0,-py+Math.floor(py)+1.75,0);
     Entity.setCollisionSize(pe,0.45,1.82);
     Entity.setPositionRelative(pe,0.4,0.1,0.5);
     Moving.Mode="null";
       if (SM.Mode.UseTip)
       {
       ModPE.showTipMessage("\n§8Done");
       }
     }
     else
     {
          if (Level.getTile(px,py-1,pz) == 9 || Level.getTile(px,py-1,pz) == 11)
          {
          if(px<0){px++;}
          if(pz<0){pz++;}
          Entity.setCollisionSize(pe,
          0.45,1.82);
          Entity.setPositionRelative(pe,
          0.45,0.4,0.45);
          Moving.Mode = "null";
          }
          if (Level.getTile(px,py-0.22-0.3,pz) > 0 && Moving.Check(px,py-0.22-0.3,pz) == false )
          {
             if(px<0){px++;}
             if(pz<0){pz++;}
             Entity.setPositionRelative(pe,0,-py+Math.floor(py)+1.75,0);
             Entity.setCollisionSize(pe,
             0.45,1.82);
             Entity.setPositionRelative(pe,
             0.45,0.1,0.45);
             Moving.Mode="null";
          }
     
          if(Moving.Mode=="Slide")
          {
              if (Entity.getVelY()<0.11 
              && Entity.getVelY() > -0.8)
              {
              new java.lang.Thread(new java.lang.Runnable({
                  run : function()
                  {
                  java.lang.Thread.sleep(25);
                  Moving.dive();
                  climbing = false;
                  }})).start();
              }
              else
              {
                 if(px<0){px++;}
                 if(pz<0){pz++;}
                 Entity.setCollisionSize(pe,
                 0.45,1.82);
                 Entity.setPositionRelative(pe,
                 0.45,0.1,0.45);
                 Moving.Mode="null";
              }
          }//slide
       }
    },
    
    crawl : function()
    {
    var px=Player.getX();
    var py=Player.getY();
    var pz=Player.getZ();
    var pe = Player.getEntity();
    
    epx = px;
    epy = py;
    epz = pz;
    
    if(px<0){px--;}
    if(pz<0){pz--;}
    
    Entity.setCollisionSize(pe,
    -1,-1);
    Entity.setPosition(pe,
    epx,epy,epz);
    
        if (!(py-Math.floor(py) == 0.1) 
        && downAct == false)
        {
            if (!(py-Math.floor(py) == 0.72))
            {
            Entity.setPositionRelative(
            0,-py+Math.floor(py)+0.72 ,0);
            }
        }
    
        if (getTile(px,py-0.9,pz) > 0)
        {
        Entity.setVelY(pe,0);
        Entity.setVelX(pe,0);
        Entity.setVelZ(pe,0);
        climbDelay = 0;
        }
        
        if (getTile(px,py-0.8,pz) > 0 
        && Moving.Check(px,py-0.8,pz) == false 
        && climbing == false 
        && downAct == false)
        {
            if (Level.getTile(px,py-1,pz) >0 
            && Moving.Check(px,py-1,pz) == false)
            {
            Entity.setPosition(pe,
            epx,Math.floor(py)+0.8,epz);
            }
        }
       
    },
    
    CancelAct : function()
    {
    var px=Player.getX();
    var py=Player.getY();
    var pz=Player.getZ();
    var pe = Player.getEntity();
    
    crawling = false;
        
        if (SM.Mode.UseTip)
        {
        ModPE.showTipMessage("\n§8Done");
        }
        Entity.setCollisionSize(pe,
        0.45,1.72);
        Entity.setPosition(pe,px,py+1.4,pz);
    
    }
     
}

/**
 * MineCraft PE의 GUI 제공을 위한 구조체입니다.
 */
var MC =
{
    ctx : null,
    
    WIDTH : null,
    HEIGHT : null,

    font : null,

    init : function ()
    {
        MC.ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
        
        MC.WIDTH = MC.ctx.getScreenWidth();
        MC.HEIGHT = MC.ctx.getScreenHeight();
        
        MC.ctx.setTheme(android.R.style.Theme_Holo_Light);

        MC.ctx.runOnUiThread(new java.lang.Runnable(
        {
            run: function () {
                try {
                    var path =
                        android.os.Environment.getExternalStorageDirectory()
                            + "/games/com.mojang/minecraftpe/mc.ttf";

                    if (!new File(path).exists()) {
                        MC.downFile("https://docs.google.com/uc?authuser=0&id=0BynSEqQ9CpItd0o3WG9JYktINlk&export=download",
                                 "/games/com.mojang/minecraftpe/", "mc.ttf");
                    }
                    else {
                        font = Typeface.createFromFile(path);
                    }
                }
                catch (e) {
                    MC.errorAlert(e);
                }
            }
        }));
    },

    onSizePatch : function (bit, size)
    {
        var lastBit = Bitmap.createBitmap(bit.getWidth() + MC.dp(size), bit.getHeight() + MC.dp(size),
                                          Bitmap.Config.ARGB_8888);
        var canvas = new Canvas(lastBit);
        canvas.drawBitmap(bit, MC.dp(size / 2), MC.dp(size / 2), null);

        return lastBit;
    },

    createNinePatch : function (bitmap, x, y, xx, yy)
    {
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

        var drawable = new android.graphics.drawable.NinePatchDrawable(MC.ctx.getResources(),
                                                                       bitmap, buffer.array(),
                                                                       new android.graphics.Rect(), null);
        return drawable;
    },

    errorAlert : function (e)
    {
        MC.ctx.runOnUiThread (new java.lang.Runnable (
        {
            run : function ()
            {
                try
                {
                    var dialog = new AlertDialog.Builder(MC.ctx);
                    dialog.setTitle("Error!");
                    var str = "Error!\n - " + e.name + "\n - #" + (e.lineNumber + 1) + "\n\n" + e.message;
                    dialog.setMessage(str);
                    dialog.show();
                }
                catch (e)
                {
                    print(e);
                }
            }
        }));
    },
    
    Toast : function (msg)
    {
        MC.ctx.runOnUiThread (new java.lang.Runnable (
        {
            run : function ()
            {
                try
                {
                var toast = new Toast(MC.ctx);
	            var textLayout = new LinearLayout(MC.ctx);
	            var backLayout = new LinearLayout(MC.ctx);
	            var tv = new MC.TextView(MC.ctx);
	            tv.setText(msg + "");
	 
                textLayout.setGravity(Gravity.CENTER | Gravity.CENTER);
                textLayout.addView(tv);
                textLayout.setPadding(MC.dp(20),MC.dp(20),MC.dp(20),MC.dp(20));
  
                backLayout.setGravity(Gravity.CENTER | Gravity.CENTER);
                backLayout.addView(textLayout);
                backLayout.setBackgroundDrawable(MC.Bitmap.PanelDrawable());
  
                toast.setView(backLayout);
                toast.show();
                }
                catch (e)
                {
                    MC.errorAlert(e);
                }
            }
        }));
     },
     
     equalEnt : function (ent1, ent2)
     {
         if (Entity.getX(ent1) == Entity.getX(ent2)  && Entity.getY(ent1) == Entity.getY(ent2)  && Entity.getZ(ent1) == Entity.getZ(ent2) && Entity.getYaw(ent1) == Entity.getYaw(ent2) &&  Entity.getPitch(ent1) == Entity.getPitch(ent2))
         {
	      return true;
         }
         else
	     return false;
     },
     
    downFile : function (url, path, fileName) //Thanks to appogattoman
    {
        MC.ctx.runOnUiThread (new java.lang.Runnable (
        {
            run : function ()
            {
                try
                {
                    var uri = new android.net.Uri.parse(url);
                    var request = new android.app.DownloadManager.Request(uri);
                    request.setTitle(fileName);
                    request.setDestinationInExternalPublicDir(path, fileName);
                    MC.ctx.getSystemService(android.content.Context.DOWNLOAD_SERVICE).enqueue(request);
                }
                catch (e)
                {
                    MC.errorAlert(e);
                }
            }
        }));
    },
    
    makePatch : function (name, offsets)
    {
    var file = new java.io.File(dataFolder, name + ".mod");

    var dos = new java.io.DataOutputStream(new java.io.FileOutputStream(file));

	dos.writeByte(0xFF);
	dos.writeByte(0x50);
	dos.writeByte(0x54);
	dos.writeByte(0x50);
	
	dos.writeByte(0x0E);
	dos.writeByte(0x02);
	dos.writeByte(0x00);
	dos.writeByte(0x00);
	
	dos.writeByte(0x00);
	dos.writeByte(0x1B);
	dos.writeByte(0x00);
	dos.writeByte(0x00);
	
	dos.writeByte(0x00);
	dos.writeByte(0x23)
	dos.writeByte(0x50);
	dos.writeByte(0x65);
	
	dos.writeByte(0x74);
	dos.writeByte(0x65);
	dos.writeByte(0x72);
	dos.writeByte(0x32);
	
	dos.writeByte(0x35);
	dos.writeByte(0x32);
	dos.writeByte(0x35);
	dos.writeByte(0x32);
	
	dos.writeByte(0x35);
	dos.writeByte(0x32);
	dos.writeByte(0x35);
	//HEADER
	
	offsets.forEach(function(offset)
    {
         dos.writeByte(0x00);

		 offset.forEach(function(hex)
         {
              dos.writeByte(hex);
		  });
	});
	dos.close();
	
	return file;
    },
    
    applyPatch : function (file)
    {
    net.zhuoweizhang.mcpelauncher.PatchManager.getPatchManager(net.zhuoweizhang.mcpelauncher.ScriptManager.androidContext).setEnabled(file, true);
    net.zhuoweizhang.mcpelauncher.Utils.getPrefs(1).edit().putBoolean("force_prepatch", true).apply();
    },

    dp : function (dips)
    {
        return Math.ceil(dips * MC.ctx.getResources().getDisplayMetrics().density);
    },
	
	fixdp : function (dips)
	{
		return MC.dp(dips) - (16/9 - MC.WIDTH/MC.HEIGHT)*10;
	},

    Bitmap :
    {
        sheet : BitmapFactory.decodeStream(
                                ModPE.openInputStreamFromTexturePack("images/gui/spritesheet.png")),
        touchGUI : BitmapFactory.decodeStream(
                                ModPE.openInputStreamFromTexturePack("images/gui/touchgui.png")),
        touchGUI2 : BitmapFactory.decodeStream(
                                ModPE.openInputStreamFromTexturePack("images/gui/touchgui2.png")),
        GUI : BitmapFactory.decodeStream(
                                ModPE.openInputStreamFromTexturePack("images/gui/gui.png")),

        NormalDrawable : function ()
        {
            var bitmap = Bitmap.createBitmap(MC.Bitmap.sheet, 8, 32, 8, 8);
            var bit = Bitmap.createScaledBitmap(bitmap, MC.dp(16), MC.dp(16), false);

            return MC.createNinePatch(bit, MC.dp(4), MC.dp(4), MC.dp(12), MC.dp(14));
        },

        PushDrawable : function ()
        {
            var bitmap = Bitmap.createBitmap(MC.Bitmap.sheet, 0, 32, 8, 8);
            var bit = Bitmap.createScaledBitmap(bitmap, MC.dp(16), MC.dp(16), false);

            return MC.createNinePatch(bit, MC.dp(4), MC.dp(4), MC.dp(12), MC.dp(14));
        },

        HeadDrawable : function ()
        {
            var bitmap = Bitmap.createBitmap(MC.Bitmap.touchGUI, 150, 26, 14, 30);

            for (var i = 0; i < 26; i++)
            {
                bitmap.setPixel(2, i, bitmap.getPixel(3, i));
                bitmap.setPixel(11, i, bitmap.getPixel(10, i));
            }

            for (var i = 3; i < 11; i++)
            {
                bitmap.setPixel(i, 25, bitmap.getPixel(i, 26));
                bitmap.setPixel(i, 26, bitmap.getPixel(i, 27));
                bitmap.setPixel(i, 27, bitmap.getPixel(i, 28));
                bitmap.setPixel(i, 28, 0x00000000);
            }

            for (var i = 0; i < 14; i++)
            {
                bitmap.setPixel(i, 25, bitmap.getPixel(4, 25));
                bitmap.setPixel(i, 26, bitmap.getPixel(4, 26));
                bitmap.setPixel(i, 27, bitmap.getPixel(4, 27));
            }

            var bit = Bitmap.createScaledBitmap(bitmap, MC.dp(28), MC.dp(60), false);

            return MC.createNinePatch(bit, MC.dp(5), MC.dp(7), MC.dp(46), MC.dp(22));
        },

        BackDrawable : function ()
        {
            var bitmap = Bitmap.createBitmap(MC.Bitmap.sheet, 0, 0, 16, 16);
            var bit = Bitmap.createScaledBitmap(bitmap, MC.dp(32), MC.dp(32), false);

            return MC.createNinePatch(bit, MC.dp(10), MC.dp(10), MC.dp(24), MC.dp(24));
        },

        FrameDrawable : function ()
        {
            var bitmap = Bitmap.createBitmap(MC.Bitmap.sheet, 28, 42, 4, 4);

            bitmap.setPixel(1, 1, Color.parseColor("#ff333333"));
            bitmap.setPixel(1, 2, Color.parseColor("#ff333333"));
            bitmap.setPixel(2, 1, Color.parseColor("#ff333333"));
            bitmap.setPixel(2, 2, Color.parseColor("#ff333333"));

            var bit = Bitmap.createScaledBitmap(bitmap, MC.dp(8), MC.dp(8), false);

            return MC.createNinePatch(bit, MC.dp(2), MC.dp(2), MC.dp(6), MC.dp(6));
        },

        XNormalDrawable : function ()
        {
            var bitmap = Bitmap.createBitmap(MC.Bitmap.sheet, 60, 0, 18, 18);
            var bit = Bitmap.createScaledBitmap(bitmap, MC.dp(100), MC.dp(100), false);

            return new BitmapDrawable(bit);
        },

        XPushDrawable : function ()
        {
            var bitmap = Bitmap.createBitmap(MC.Bitmap.sheet, 78, 0, 18, 18);
            var bit = Bitmap.createScaledBitmap(bitmap, MC.dp(100), MC.dp(100), false);

            return new BitmapDrawable(bit);
        },

        InvenBackDrawable : function ()
        {
            var bitmap = Bitmap.createBitmap(MC.Bitmap.GUI, 200, 46, 16, 16);
            var bit = Bitmap.createScaledBitmap(bitmap, MC.dp(42), MC.dp(42), false);

            return MC.createNinePatch(bit, MC.dp(2), MC.dp(2), MC.dp(40), MC.dp(40));
        },

        CaseDrawable : function ()
        {
            var bitmap = Bitmap.createBitmap(MC.Bitmap.sheet, 10, 42, 16, 16);
            var bit = Bitmap.createScaledBitmap(bitmap, MC.dp(32), MC.dp(32), false);

            return MC.createNinePatch(bit, MC.dp(8), MC.dp(8), MC.dp(20), MC.dp(20));
        },

        ArrawBitmap : function ()
        {
            var bitmap = Bitmap.createBitmap(MC.Bitmap.sheet, 73, 36, 22, 15);

            return Bitmap.createScaledBitmap(bitmap, MC.dp(44), MC.dp(30), false);
        },

        PanelDrawable : function ()
        {
            var bitmap = Bitmap.createBitmap(MC.Bitmap.sheet, 34, 43, 14, 14);
            var bit = Bitmap.createScaledBitmap(bitmap, MC.dp(56), MC.dp(56), false);

            return MC.createNinePatch(bit, MC.dp(12), MC.dp(12), MC.dp(44), MC.dp(44));
        },

        SwitchOffDrawable : function ()
        {
            var bitmap = Bitmap.createBitmap(MC.Bitmap.touchGUI, 160, 206, 38, 19);
            var bit = Bitmap.createScaledBitmap(bitmap, MC.dp(76), MC.dp(38), false);

            return new BitmapDrawable(bit);
        },

        SwitchOnDrawable : function ()
        {
            var bitmap = Bitmap.createBitmap(MC.Bitmap.touchGUI, 198, 206, 38, 19);
            var bit = Bitmap.createScaledBitmap(bitmap, MC.dp(76), MC.dp(37), false);

            return new BitmapDrawable(bit);
        },

        SelectDrawable : function ()
        {
            var bitmap = Bitmap.createBitmap(MC.Bitmap.sheet, 38, 11, 8, 4);
            var bit = Bitmap.createScaledBitmap(bitmap, MC.dp(32), MC.dp(16), false);

            return new BitmapDrawable(bit);
        },

        Option :
        {
            Bitmap : function ()
            {
                var bitmap = Bitmap.createBitmap(MC.Bitmap.touchGUI, 218, 0, 20, 20);
                var bit = Bitmap.createScaledBitmap(bitmap, MC.dp(40), MC.dp(40), false);

                return bit;
            },

            NormalBitmap : function ()
            {
                var bitmap = Bitmap.createBitmap(MC.Bitmap.touchGUI2, 134, 0, 28, 28);
                var bit = Bitmap.createScaledBitmap(bitmap, MC.dp(56), MC.dp(56), false);

                return bit;
            },

            SkinBitmap : function ()
            {
                var bitmap = Bitmap.createBitmap(MC.Bitmap.touchGUI2, 106, 56, 26, 26);
                var bit = Bitmap.createScaledBitmap(bitmap, MC.dp(54), MC.dp(54), false);

                return bit;
            },

            GameBitmap : function ()
            {
                var bitmap = Bitmap.createBitmap(MC.Bitmap.touchGUI2, 106, 0, 28, 28);
                var bit = Bitmap.createScaledBitmap(bitmap, MC.dp(56), MC.dp(56), false);

                return bit;
            },

            GraphicBitmap : function ()
            {
                var bitmap = Bitmap.createBitmap(MC.Bitmap.touchGUI2, 134, 27, 28, 28);
                var bit = Bitmap.createScaledBitmap(bitmap, MC.dp(56), MC.dp(56), false);

                return bit;
            },
        },
    
        GUIButton :
        {
            JumpDrawable : function ()
            {
                var bitmap = Bitmap.createBitmap(MC.Bitmap.GUI, 108, 111, 18, 18);
                var bit = Bitmap.createScaledBitmap(bitmap, MC.dp(36), MC.dp(36), false);

                return new BitmapDrawable(bit);
            },
            
            FlyUpDrawable : function ()
            {
                var bitmap = Bitmap.createBitmap(MC.Bitmap.GUI, 56, 139, 18, 18);
                var bit = Bitmap.createScaledBitmap(bitmap, MC.dp(36), MC.dp(36), false);

                return new BitmapDrawable(bit);
            },
            
            FlyDownDrawable : function ()
            {
                var bitmap = Bitmap.createBitmap(MC.Bitmap.GUI, 82, 135, 18, 18);
                var bit = Bitmap.createScaledBitmap(bitmap, MC.dp(36), MC.dp(36), false);

                return new BitmapDrawable(bit);
            },
        },
        
        LayerBitmap : function ()
        {
            var bit = Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888);
            bit.setPixels([Color.parseColor("#30000000")], 0, 1, 0, 0, 1, 1);

            var bitmap = Bitmap.createScaledBitmap(bit, MC.dp(8), MC.dp(8), false);
            return bitmap;
        }
    },
    
    Button : function ()
    {
        var bt = new Button(MC.ctx);

        bt.setTextColor(Color.parseColor("#ffe1e1e1"));
        bt.setTextSize(16);
        bt.setTypeface(MC.font);
        bt.setShadowLayer(1, MC.dp(2), MC.dp(2), Color.argb(255, 44, 44, 44));

        bt.setOnTouchListener (new OnTouchListener (
        {
            onTouch: function (view, event)
            {
                if (event.getAction() == MotionEvent.ACTION_DOWN)
                {
                    bt.setBackgroundDrawable(MC.Bitmap.PushDrawable());
                    bt.setTextColor(Color.parseColor("#ffffa1"));
                }
                if (event.getAction() == MotionEvent.ACTION_UP)
                {
                    bt.setBackgroundDrawable(MC.Bitmap.NormalDrawable());
                    bt.setTextColor(Color.parseColor("#e1e1e1"));
                }

                return false;
            }
        }));
        bt.setBackgroundDrawable(MC.Bitmap.NormalDrawable());

        return bt;
    },

    ImageButton : function (bit)
    {
        var bt = new ImageView(MC.ctx);

        bt.setClickable(true);
        bt.setOnTouchListener (new OnTouchListener (
        {
            onTouch: function (view, event)
            {
                if (event.getAction() == MotionEvent.ACTION_DOWN)
                {
                    bt.setImageBitmap(MC.onSizePatch(bit, 20));
                    bt.setBackgroundDrawable(MC.Bitmap.PushDrawable());
                }
                if (event.getAction() == MotionEvent.ACTION_UP)
                {
                    bt.setImageBitmap(MC.onSizePatch(bit, 16));
                    bt.setBackgroundDrawable(MC.Bitmap.NormalDrawable());
                }
                return false;
            }
        }));
        bt.setBackgroundDrawable(MC.Bitmap.NormalDrawable());

        return bt;
    },
    
    GUIButton : function (bit)
    {
        var bt = new ImageView(MC.ctx);
        
        bt.setAlpha(0.5);
        bt.setClickable(true);
        bt.setOnTouchListener (new OnTouchListener (
        {
            onTouch: function (view, event)
            {
                if (event.getAction() == MotionEvent.ACTION_DOWN)
                    bt.setImageBitmap(MC.Bitmap.LayerBitmap());
                if (event.getAction() == MotionEvent.ACTION_UP)
                    bt.setImageBitmap(null);
                return false;
            }
        }));
        bt.setBackgroundDrawable(bit);

        return bt;
    },
    
    SwitchOn : function (isOn)
    {
    isOn = true;
        var bt = new ToggleButton(MC.ctx);

        bt.setText("");
        bt.setTextOn("");
        bt.setTextOff("");
        
        bt.setOnClickListener (new OnClickListener (
        {
            onClick : function (view)
            {
                if (bt.isChecked())
                    bt.setBackgroundDrawable(MC.Bitmap.SwitchOnDrawable());
                if (!bt.isChecked())
                    bt.setBackgroundDrawable(MC.Bitmap.SwitchOffDrawable());
            }
        }));
        bt.setBackgroundDrawable(MC.Bitmap.SwitchOffDrawable());

        if (isOn)
        {
            bt.setBackgroundDrawable(MC.Bitmap.SwitchOnDrawable());
            bt.setChecked(true);
        }

        return bt;
    },
    
    SwitchOff : function (isOn)
    {
    isOn = false
        var bt = new ToggleButton(MC.ctx);

        bt.setText("");
        bt.setTextOn("");
        bt.setTextOff("");
        
        bt.setOnClickListener (new OnClickListener (
        {
            onClick : function (view)
            {
                if (bt.isChecked())
                    bt.setBackgroundDrawable(MC.Bitmap.SwitchOnDrawable());
                if (!bt.isChecked())
                    bt.setBackgroundDrawable(MC.Bitmap.SwitchOffDrawable());
            }
        }));
        bt.setBackgroundDrawable(MC.Bitmap.SwitchOffDrawable());

        if (isOn)
        {
            bt.setBackgroundDrawable(MC.Bitmap.SwitchOnDrawable());
            bt.setChecked(true);
        }

        return bt;
    },

    ImageToggle : function ()
    {
        var bt = new ImageView(MC.ctx);

        bt.setClickable(true);
        bt.setBackgroundDrawable(MC.Bitmap.NormalDrawable());

        return bt;
    },

    XButton : function ()
    {
        var bt = new Button(MC.ctx);

        bt.setOnTouchListener (new OnTouchListener (
        {
            onTouch: function (view, event)
            {
                if (event.getAction() == MotionEvent.ACTION_DOWN)
                    bt.setBackgroundDrawable(MC.Bitmap.XPushDrawable());
                if (event.getAction() == MotionEvent.ACTION_UP)
                    bt.setBackgroundDrawable(MC.Bitmap.XNormalDrawable());

                return false;
            }
        }));
        bt.setBackgroundDrawable(MC.Bitmap.XNormalDrawable());

        return bt;
    },

    TextView : function ()
    {
        var tv = new TextView(MC.ctx);

        tv.setTextColor(Color.parseColor("#ffe1e1e1"));
        tv.setTextSize(16);
        tv.setTypeface(MC.font);
        tv.setShadowLayer(1, MC.dp(2), MC.dp(2), Color.argb(255, 44, 44, 44));

        return tv;
    },

    Option : function ()
    {
        var index = -1;
        var index2 = -1;
        
        var keyCodeList = new Array();
        var variationList = new Array();
        
        var option = new PopupWindow(MC.ctx);

        var layout_main = new FrameLayout(MC.ctx);
        var layout_title = new FrameLayout(MC.ctx);
        var title = new MC.TextView(MC.ctx);

        var layout_close = new LinearLayout(MC.ctx);
        var close = new MC.Button(MC.ctx);

        var layout_left = new LinearLayout(MC.ctx);
        var layout_list = new Array();
        var layout_scr = new Array();
        var tv_head = new Array();

        var slot = new Array();
		
		var m_slot_margin = new Array();
		
        title.setText("설정");
        title.setGravity(Gravity.CENTER | Gravity.CENTER);

        close.setText("돌아가기");
        close.setOnClickListener (new OnClickListener (
        {
            onClick : function (view)
            {
                option.dismiss();
                option = null;
            }
        }));

        layout_close.setPadding(MC.dp(5), MC.dp(8), MC.dp(5), MC.dp(5));
        layout_close.addView(close);

        layout_title.setBackgroundDrawable(MC.Bitmap.HeadDrawable());
        layout_title.addView(layout_close, MC.dp(96), MC.dp(48));
        layout_title.addView(title, MC.WIDTH, MC.dp(55));

        layout_left.setPadding(0, MC.dp(70), 0, MC.dp(20));
        layout_left.setOrientation(1);
        layout_left.setGravity(Gravity.CENTER | Gravity.CENTER);
        layout_left.setBackgroundDrawable(new ColorDrawable(Color.parseColor("#FF948781")));
        
        this.setTitle = function (str) {
            title.setText(str);
        };

        this.addSlot = function (bit)
        {
            index++;
            
            var thisIndex = index;
            
			m_slot_margin[index] = new LinearLayout(MC.ctx);
            slot[index] = new MC.ImageToggle(MC.ctx);

            slot[index].setOnClickListener (new OnClickListener (
            {
                onClick : function (view)
                {
                    for (var i in slot)
                    {
                        slot[i].setBackgroundDrawable(MC.Bitmap.NormalDrawable());
                        layout_list[i].setVisibility(GONE);
                        layout_scr[i].setVisibility(GONE);
                    }
                    view.setBackgroundDrawable(MC.Bitmap.PushDrawable());
                    layout_list[thisIndex].setVisibility(VISIBLE);
                    layout_scr[thisIndex].setVisibility(VISIBLE);
                }
            }));

            slot[index].setImageBitmap(bit);

            layout_list[index] = new LinearLayout(MC.ctx);
            layout_list[index].setOrientation(1);
            layout_list[index].setPadding(MC.dp(100), MC.dp(65), MC.dp(0), MC.dp(0));
            layout_list[index].setVisibility(GONE);

            layout_scr[index] = new ScrollView(MC.ctx);
            layout_scr[index].setVisibility(GONE);

            if (index == 0)
            {
                slot[index].setBackgroundDrawable(MC.Bitmap.PushDrawable());
                layout_list[index].setVisibility(VISIBLE);
                layout_scr[index].setVisibility(VISIBLE);
            }
			
			m_slot_margin[index].setGravity(Gravity.CENTER | Gravity.CENTER);
            m_slot_margin[index].addView(slot[index], MC.dp(55), MC.dp(55));
			layout_left.addView(m_slot_margin[index], MC.dp(55), MC.dp(57.5));
			
            layout_scr[index].addView(layout_list[index]);
            layout_main.addView(layout_scr[index], MC.WIDTH, MC.HEIGHT);
        };

        this.addText = function (str)
        {
            index2++;
            
            tv_head[index2] = new MC.TextView(MC.ctx);
            tv_head[index2].setText(str);
            
            layout_list[index].addView(tv_head[index2]);
        };

        this.addSwitchOn = function (name, keyCode, variation, offClickFunc, onClickFunc)
        {
            variationList.push(variation);
            keyCodeList.push(keyCode);
            
            var layout = new LinearLayout(MC.ctx);
    
            var tv = new MC.TextView();
            tv.setText("   " + name);
            tv.setTextColor(Color.parseColor("#FFB5B5B5"));

            var isCheck = ModPE.readData(keyCode);
            var bool;
            
            if (isCheck == "true")
                bool = true;
            else
                bool = false;
                    
            eval(variation + "=" + bool + ";");
            
            ModPE.saveData(keyCode, true);
            
            var switch_ = new MC.SwitchOn(bool);
            switch_.setOnClickListener (new OnClickListener (
            {
                onClick : function (view)
                {
                    if (view.isChecked())
                    {
                        view.setBackgroundDrawable(MC.Bitmap.SwitchOnDrawable());
                        eval(variation + " = true;");
                        eval(onClickFunc+"");
                    }
                    if (!view.isChecked())
                    {
                        view.setBackgroundDrawable(MC.Bitmap.SwitchOffDrawable());
                        eval(variation + " = false;");
                        eval(onClickFunc+"");
                    }

                    ModPE.saveData(keyCode, true);
        
                }
            }));

            layout.addView(tv, MC.WIDTH - MC.dp(105) - MC.dp(95), MC.dp(40));
            layout.addView(switch_, MC.dp(80), MC.dp(40));

            layout_list[index].addView(layout, MC.WIDTH - MC.dp(105) - MC.dp(15), MC.dp(45));
        };
        
        this.addSwitchOff = function (name, keyCode, variation, offClickFunc, onClickFunc)
        {
            variationList.push(variation);
            keyCodeList.push(keyCode);
            
            var layout = new LinearLayout(MC.ctx);
    
            var tv = new MC.TextView();
            tv.setText("   " + name);
            tv.setTextColor(Color.parseColor("#FFB5B5B5"));

            var isCheck = ModPE.readData(keyCode);
            var bool;
            
            if (isCheck == "true")
                bool = true;
            else
                bool = false;
                    
            eval(variation + "=" + bool + ";");
            
            ModPE.saveData(keyCode, false);
            
            var switch_ = new MC.SwitchOff(bool);
            switch_.setOnClickListener (new OnClickListener (
            {
                onClick : function (view)
                {
                    if (view.isChecked())
                    {
                        view.setBackgroundDrawable(MC.Bitmap.SwitchOnDrawable());
                        eval(variation + " = true;");
                        eval(onClickFunc+"");
                    }
                    if (!view.isChecked())
                    {
                        view.setBackgroundDrawable(MC.Bitmap.SwitchOffDrawable());
                        eval(variation + " = false;");
                        eval(onClickFunc+"");
                    }

                    ModPE.saveData(keyCode, false);
        
                }
            }));

            layout.addView(tv, MC.WIDTH - MC.dp(105) - MC.dp(95), MC.dp(40));
            layout.addView(switch_, MC.dp(80), MC.dp(40));

            layout_list[index].addView(layout, MC.WIDTH - MC.dp(105) - MC.dp(15), MC.dp(45));
        };

        this.end = function ()
        {
            if (index < 6)
                layout_main.addView(layout_left, MC.dp(75), MC.HEIGHT);
            else
            {
                var layout_left_scr = new ScrollView(MC.ctx);
                
                layout_left_scr.addView(layout_left, MC.dp(75), MC.HEIGHT);
                layout_left_scr.setBackgroundDrawable(new ColorDrawable(Color.parseColor("#FF948781")));

                layout_main.addView(layout_left_scr, MC.dp(75), MC.HEIGHT);
            }
            layout_main.addView(layout_title, MC.WIDTH, MC.dp(60));
        };

        this.getWindow = function () {
            return option;
        };
        
        this.show = function ()
        {
            option = new PopupWindow(MC.ctx);
            option.setContentView(layout_main);
            option.setBackgroundDrawable(new ColorDrawable(Color.parseColor("#80000000")));
            option.setWidth(MC.WIDTH);
            option.setHeight(MC.HEIGHT);
            option.showAtLocation(MC.ctx.getWindow().getDecorView(),
                                  Gravity.RIGHT | Gravity.BOTTOM,
                                  MC.dp(0), MC.dp(0));
        };
        
        this.destroy = function ()
        {
            option.dismiss();
            option = null;
        };
        
        this.init = function ()
        {
            for (var i in keyCodeList)
            {
                if (ModPE.readData(keyCodeList[i]) != "")
                    eval(variationList[i] + " = " + ModPE.readData(keyCodeList[i]) + ";");
                else
                    eval(variationList[i] + " = false;");
            }
        };       
    },
    
    ImageBar : function (fullImage, halfImage,
                         widthMargin, heightMargin, isReverse)
    {
        var window = new PopupWindow(MC.ctx);      
        var layout_main = new LinearLayout(MC.ctx);
        window.setTouchable(false);
        
        var image = new Array();
        var _value = 0;
        
        for (var i = 0; i < 10; i++)
        {
            if (!isReverse)
            {
                image[i] = new ImageView(MC.ctx);
                layout_main.addView(image[i],MC.dp(15),MC.dp(15));
            }
            else if (isReverse)
            {
                image[9-i] = new ImageView(MC.ctx);
                layout_main.addView(image[9-i],MC.dp(15),MC.dp(15));
            }
        }
        
        this.setValue = function (value)
        {
            var last = 0;
            _value = value;
            
            for (var i = 0; i < 10; i++)
            {
                if (i < _value/2)
                {
                    image[i].setImageBitmap(fullImage);
                    last++;
                }
                else
                    image[i].setImageBitmap(null);
            }
            
            if (_value%2 == 1 && _value != 0)
                image[last-1].setImageBitmap(halfImage);
        };
        
        this.getValue = function ()
        {
            return _value;
        };
        
        this.getWindow = function ()
        {
            return window;
        };
        
        this.show = function ()
        {
            window.setContentView(layout_main);
            window.setBackgroundDrawable(null);
            window.setWidth(MC.dp(150));
            window.setHeight(MC.dp(15));
            window.showAtLocation(MC.ctx.getWindow().getDecorView(),
                                  Gravity.CENTER | Gravity.BOTTOM,
                                   widthMargin, heightMargin);
        };
        
        this.destroy = function ()
        {
            window.dismiss();
            //window = null;
        };
    }
};

MC.init();

MC.ctx.runOnUiThread (new java.lang.Runnable (
    {
        run : function ()
        {
            try
            {
                if(!dataFolder.exists())
                {
                 dataFolder.mkdirs();
		         new java.io.File(dataFolder, ".nomedia").createNewFile();
                }

                 var file = MC.makePatch("SmartMoving", [ 
                                                    [0x59,0x97,0xd0, 0x00,0xBF,0x70,0x47], 
                                                    [0x59,0x9b,0xe8, 0x00,0xBF,0x70,0x47] ]);
	             MC.applyPatch(file);
            }
            catch (e)
            {
                MC.errorAlert(e);
            }
        }
    }));
    
    