	<style type="text/css">
			body,ul,p,select,option{margin:0;padding:0; font-size:0.5rem; font-family:"微软雅黑","宋体";}
			li{ list-style:none;}
			h1{font-size: 0.4rem;font-weight: normal;width: 90%;margin: 10px auto;}
			a{ text-decoration:none;color:#fff;}
			
			.page{width: 100%;left: 0;top: 0;height: 100%;overflow: auto;position: absolute;}
			.tittle{width: 90%;margin: 0 auto;height: 2rem;border-bottom: 1px solid darkgray;text-align: center;line-height: 2.6rem;font-size: 0.6rem;}
			.content{width: 90%;margin: 0 auto;}
			.forms{width: 90%;margin: 0 auto;}
			.forms p{margin-top: 0.4rem;margin-bottom: 0.2rem;}
			.forms input{width: 100%;height: 1rem;border: 1px solid darkgrey;outline: none;font-size: 0.55rem;margin: 0 auto;}
			.pic p{font-size: 0.35rem;}
			.pic div{display: inline-block;}
			.pic img{width: 30px;height: 30px;}
			#submitpic{width: 1.4rem;height: 1.4rem;background: url(../images/31289934840157287.png) no-repeat;background-size: cover;}
			label{color: red;}
			.forms .sub{margin: 1rem 0;}
			.ok{width: 100%;height:100%;position: absolute;left: 0;top: 0;background:rgba(0,0,0,.5);display: none;}
			.zhezhao{width: 90%;margin: 20px auto;background: #FFFFFF;}
			.zhezhao input{width: 1.5rem;height: 1rem;margin: 1rem 1rem 1rem 0.3rem;}
			.zhezhao p{display: inline-block;}
		</style>
		<script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.min.js"></script>
		<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js" type="text/javascript" charset="utf-8"></script>
		<script src="${rc.contextPath}/scripts/jquery.validate.js" type="text/javascript" charset="utf-8"></script>
		<script type="text/javascript">
			$(function(){
				$('html').css('font-size',$(window).width()/10);
				$(window).resize(function(){
					$('html').css('font-size',$(window).width()/10);
				});
				var $subs = $('#subs');
				var $confim = $('#confirm');
				var $cancle = $("#cancle");
				var $forms = $('.forms');
				var $submitpic = $("#submitpic");
				bankvalue();
				function bankvalue(){
					var selects = $('#selects');
					var str = '';
					var banks =['农业银行','北京银行','工商银行','中国银行','渤海银行','建设银行','重庆三峡银行','光大银行','兴业银行','中信银行','城市商业银行','招商银行','民生银行','交通银行','村镇银行','浙商银行','恒丰银行','福建省农村信用社联合社','广发银行','广州农商银行','广州银行','东亚银行','徽商银行','华夏银行','宁波银行','中国邮储银行','农村商业银行','农村信用合作社','农村合作银行','渣打银行','上海农商银行','浦发银行','平安银行','城市信用合作社','杭州联合银行','友利银行'];
					
					for(var i=0;i<banks.length;i++){
						str+='<option value="'+banks[i]+'">'+banks[i]+'</option>'
					}
					selects.html(str);
				};
				$subs.on('click',function(){
					var oInput = $('.forms').find('input');
					var oP = $('#dialog').find('h1 p');
					//alert(oInput.length)
					for (var i=0;i<8;i++) {
						oP[i].innerHTML=oInput[i].value;
					}
					oP[9].innerHTML=$('#selects option:selected').val();
					$('.ok').css('display','block');
					$('.page').css('overflow','hidden');
				});
				
				$confim.on('click',function(){
					//$('.forms').submit();
			
					$('.ok').css('display','none');
					$('.page').css('overflow','auto');
					//console.log($forms.serialize())
				});
				$cancle.on('click',function(){
					$('.ok').css('display','none');
					$('.page').css('overflow','auto');
				});
				//城市二级联动
				setCity("cardProvIds", "","${rc.contextPath}/ajax/queryProvId");
			        $("#cardProvIds").change(function() {
			            // 当省级改变的时候，让市级和县级文本清空
			            $("#cardAreaIds option").remove();
			             //获得省级的id
			            var pid=$("#cardProvIds option:selected").attr("id");
			             //加载该省级的市级数据
			            setCity("cardAreaIds", pid,"${rc.contextPath}/ajax/queryProvArea");
			        });
				function setCity(selectid, pid,url) {
			        $.ajax({
			            url : url,
			            type : "post",
			            cache : false,
			            data:{
			            	provId:pid
			            },
			            success : function(res) {
			                $.each(res, function(key, val) {
			                    $("#" + selectid).append(" <option id='" + val.key + "'>"+ val.value + "</option>");
			                });
			            }
			        });
			    };
				//获取微信参数
				$.ajax({
					type:"get",
					url:"${rc.contextPath}/fcpay/getWeChatParm",
					async:false,
					data:{
						url:'/weuipay/mermagRegister',
					},
					success:function(data){
						 wxAppId = data.appId;
						 wxTimestamp = data.timestamp;
						 wxNonceStr = data.noncestr;
						 wxSignature = data.signature;
					}
				});
				
				//拍照上传
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: wxAppId, // 必填，公众号的唯一标识
					timestamp:wxTimestamp, // 必填，生成签名的时间戳
					nonceStr:wxNonceStr , // 必填，生成签名的随机串
					signature: wxSignature, // 必填，签名，见附录1
					jsApiList: [
							'chooseImage',
							'uploadImage'
					] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
				wx.ready(function() {
					var images = {
						localId: [],
						serverId: [],
					}
				});
				$submitpic.click(function(){
					wx.chooseImage({
						count: 1, // 默认9
						sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
						sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
						success: function(res) {
							images.localId = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
							len = images.localId.length;//返回本地Id列表的长度
							uploadimage(images.localId);//上传图片到服务器
							$(".pic").append("<img src="+images.localId+"/>")
						}
					})
				});
				var uploadimage	 = function(localIds) {
					var localId = localIds.shift();//每次选取ID列表的第一个上传
					wx.uploadImage({
						localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
						isShowProgressTips: 1, // 默认为1，显示进度提示
						success: function(res) {
							images.serverId.push(res.serverId);//把上传的微信服务器id存储到image对象里
							if(len == images.serverId.length) {
								 serverids = images.serverId.join(',');//把数组改成字符串
								//uploadserverid(serverids);//把数据上传到本地服务器
								//images.localId = images.serverId = [];//销毁数据
							}
							if(localIds.length > 0) {
								uploadimage(localIds);//如果还有图片未上传到
							}
						},
						error: function() {
							alert("上传失败");
						}
					});
				}
				
				$forms.validate({//表单提交
					rules: {
						usrName: "required",
						staffName: "required",
						staffCertId: "required",
						operMp:"required",
						printName:"required",
						posAddr:"required",
						cardId:"required",
						calcModeP:"required"
					},
					submitHandler:function(form){
						if($("#printNames").val()==''){
							$("#printNames").val($("#usrNames").val());
						}
						$.ajax({
							url:$forms.attr("action"),
							type:"post",
							data:{
								xxx:$forms.serialize()
							},
							dataType:"json",
							success:function(){
								
							}
						});
					}
				});
			});
		</script>
	<div class="page">
	<form class="forms" action="" method="post">
		<div class="content">
			
			<div class="tittle">商户注册</div>
			
				<p>商户全称：</p>
				<input type="text" name="usrName" value="" id="usrNames" />
				<p>企业法人姓名：</p>
				<input type="text" name="staffName" value="" id="staffNames"  />
				<p>法人证件号：</p>
				<input type="text" name="staffCertId" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"  value="" minlength="18" id="staffCertIds"/>
				<p>操作员手机：</p>
				<input type="text" onkeyup="this.value=this.value.replace(/[^0-9]/g,'')" onafterpaste="this.value=this.value.replace(/[^0-9]/g,'')" name="operMp" value=""  maxlength="11" id="operMps" />
				<p>小票打印名称：</p>
				<input type="text"  name="printName" value="" placeholder="不填默认与商户全称一样" id="printNames"  />
				<p>pos安装地址：</p>
				<input type="text" name="posAddr" value="" id="posAddrs" />
				<p>结算卡号：</p>
				<input type="text" onkeyup="this.value=this.value.replace(/[^0-9]/g,'')" onafterpaste="this.value=this.value.replace(/[^0-9]/g,'')" id="" name="cardId" value="" id="cardIds" />
				<p>费率：</p>
				<input type="text" id="" name="calcModeP" value=""  id="calcModePs"/>
				<p>开户所属银行：</p>
				<select name="bankId" id="selects" style="-webkit-appearance: none;" >
				</select>
				<p>开户行地址：</p>
				<select name="cardProvId" id="cardProvIds">
					<option value="">请选择省市</option>
				</select>
				<select name="cardAreaId" id="cardAreaIds">
					<option value="">请选择城市</option>
				</select>
				
				<div class="pic">
					<p>请上传您的身份证正反面以及您手持身份证照片</p>
					<div id="submitpic"></div>
				</div>
				<input class="sub"  id="subs" type="button" value="提交"/>
				
			
			</div>
		</div>
		<div class="ok">
				<div class="zhezhao" id="dialog">
					<div class="tittle">确认您的信息</div>
					<h1>商户全称：<p></p></h1>
					<h1>企业法人姓名：<p></p></h1>
					<h1>法人证件号：<p></p></h1>
					<h1>操作员手机：<p></p></h1>
					<h1>小票打印名称：<p></p></h1>
					<h1>pos安装地址：<p></p></h1>
					<h1>结算卡号：<p></p></h1>
					<h1>费率：<p></p></h1>
					<h1>开户所属银行：<p></p></h1>
					<h1>开户行地址：<p></p></h1>
					<input type="submit" id="confirm" value="确认" />
					<input type="button" id="cancle" value="返回" />
				</div>
		</div>
	</form>
