(function(){
		$('html').css('font-size', $(window).width() / 10);
		$(window).resize(function() {
			$('html').css('font-size', $(window).width() / 10);
		});
})(jQuery);
$(function() {
	//登录数据
	var custId = localStorage.getItem('custId');  //6000000022   localStorage.getItem('custId')
	var operSeqId = localStorage.getItem('operSeqId'); // localStorage.getItem('operSeqId')
	var level0Id = localStorage.getItem('level0Id'); //0级代理
	var level1Id = localStorage.getItem('level1Id'); //1级代理
	var level2Id = localStorage.getItem('level2Id'); //2级代理
	
	$("#custIds").val(custId);
	$("#operSeqIds").val(operSeqId);
	var $next = $("#next"); //下一步
	var storage = window.localStoragee;
	var oLabel = $("#oform").find("label");
	var $oImg = $("#oImg");
	var imgage = '';
	var $cardAcctType = $("#cardAcctType");//银行卡开户类型
	var $mcctext = $("#mcctext");//mcc码
	var $mccCodeList = $("#mccCodeList");//mcc列表
	var $certificateInfo = $("#certificateInfo");//证照信息
	var $usrProv = $("#usrProv");//营业所在省
	var $cardProvId =  $("#cardProvId");//开户所在省
	var $sftDistrictName = $("#sftDistrictName");//营业地址所在区
	var $districtList = $("#districtList");//营业地址所在区列表
	var $sftBankBranchName = $("#sftBankBranchName");//开户分支行名称
	var $districtName = $("#districtName");
	selectoption($("#cardAcctType"),"openStat",$("#cardAcctType"),"");//获取进件类型
	isSelect();
	
	
	//获取用户代理级别
	$.ajax({
		type:"post",
		//url:"http://192.168.1.121:7070/smart/mobile/getUsrLevel?custId="+custId+"",
		url:"http://dev.yanfumall.com:7070/netrecv/weuipay/getUsrLevel?custId="+custId+"",
		async:true,
		success:function(data){
			if (data.level == 0) { 
				$("#level0Mag").val(level0Id);
				$("#jigou").show();
				$("#firstjigou,#secontjigou").show();
				$.ajax({//获取机构数据
					type:"post",
					//url:"http://192.168.1.121:7070/smart/mobile/getLevelList?custId="+custId+"",
					url:"http://dev.yanfumall.com:7070/netrecv/weuipay/getLevelList?custId="+custId+"&lowLevel=1",
					async:false,
					success:function(data){
						var level1 = '';
						$.each(data, function(item,key) {
							level1+="<option value="+item+" >"+key+"</option>"
						});
						$("#level1Mag").html(level1);
						
						var levalid = $("#level1Mag").find('option').eq(0).val();
						getlevel2(levalid)
						$("#level1Mag").change(function(){
							var level2val = $(this).find('option:selected').val();
							getlevel2(level2val)
						});
					}
				});
			}else if(data.level == 1){
				$("#level0Mag").val(level0Id);
				$("#firstjigou").hide();
				$("#level1Mag").html("<option value="+level1Mag+">"+level1Mag+"</option>");
				$("#jigou,#secontjigou").show();
				getlevel2(custId);
			}else if(data.level == 2){
				$("#level0Mag").val(level0Id);
				$("#level1Mag").html("<option value="+level1Id+">"+level1Id+"</option>");
				$("#level2Mag").html("<option value="+level2Id+">"+level2Id+"</option>");
				$("#jigou,#firstjigou,#secontjigou").hide();
				
			}
		}
	});
	//获取二级机构
	function getlevel2(custid){
		$.ajax({
			type:"post",
			//url:"http://192.168.1.121:7070/smart/mobile/getLevelList?custId="+custid+"",
			url:"http://dev.yanfumall.com:7070/netrecv/weuipay/getLevelList?custId="+custid+"&lowLevel=2",
			async:true,
			success:function(data){
				var level2 = '';
				$.each(data, function(item,key) {
					level2+="<option value="+item+" >"+key+"</option>";
				});
				$("#level2Mag").html(level2);
			}
		});
	}
	//获取省份  城市
	$.ajax({
		type:"post",
		//url:"http://192.168.1.121:7070/smart/mobile/getProvinceList",
		url:"http://dev.yanfumall.com:7070/netrecv/weuipay/getProvinceList",
		async:true,
		dataType:"json",
		success:function(data){
			var str=''
			$.each(data, function(item,key) {
				str+="<option ProvId="+item+" value="+item+" >"+key+"</option>";
			});
			$usrProv.html(str);
			$cardProvId.html(str);
			
			selectoption($usrProv,"usrProv",$("#usrArea"),"usrArea");
			selectoption($cardProvId,"cardProvId",$("#cardAreaId"),"cardAreaId");
		
			
			$usrProv.change(function(){  //营业省
				var ProvId = $usrProv.find("option:selected").attr('ProvId');
				var ProvVal =  $usrProv.find("option:selected").text();
				findArea(ProvId,$("#usrArea"));
			});
			$cardProvId.change(function(){ //开户省
				var ProvId = $cardProvId.find("option:selected").attr('ProvId');
				var ProvVal =  $cardProvId.find("option:selected").text();
				$("#sftProvCode").val(ProvId)
				findArea(ProvId,$("#cardAreaId"));
			});
		}
	});
	function findArea(areaId,obj){  //获取城市列表
		$.ajax({
			type:"post",
			//url:"http://192.168.1.121:7070/smart/mobile/getAreaList?provId="+areaId+"",
			url:"http://dev.yanfumall.com:7070/netrecv/weuipay/getAreaList?provId="+areaId+"",
			async:true,
			success:function(areaList){
				var str1='';
				$.each(areaList, function(item,key) {
					str1+="<option areaid="+item+" value="+item+" >"+key+"</option>";
				});
				obj.html(str1);
				
			}
		});
	};
	//获取银行类型列表
	$.ajax({
		type:"post",
		//url:"http://192.168.1.121:7070/smart/mobile/getBankList",
		url:"http://dev.yanfumall.com:7070/netrecv/weuipay/getBankList",
		async:true,
		success:function(data){
			var bankName = '';
			$.each(data, function(item,key) {
				bankName+="<option bankId="+item+" value="+key+">"+key+"</option>";
			});
			$("#bankId").html(bankName);
			selectoption($("#bankId"),"bankId",$("#bankId"),"");//获取银行类型列表
			//$("#bankCode").val($("#bankId").children().eq(0).attr('bankId'));
			$("#bankId").change(function(){
				$("#bankCode").val($("#bankId").find("option:selected").attr('bankId'))
			});
		}
	});
	
	/*if(window.localStorage.getItem("formValName")!=null) {  //判断有没有输入过

		var a = window.localStorage.getItem("formValName");
		//console.log(a)
		var inputValue = a.split('&');
		var arr = [];
		var reg = /([^=\s]+)=/g; //去掉等号左边的字符
		for(var i = 0; i < inputValue.length; i++) {
			arr.push(inputValue[i].replace(reg, '')); //得到整理后的字符
		}
		
		for(var i=0;i<arr.length;i++){
			if(new RegExp("[\%\w]").test(arr[i])){  //汉字编码
				arr[i] = decodeURI(arr[i])
			}
			if(oLabel.eq(i).data('type')== 'select'){
				
			}else{
				var oInput = oLabel.eq(i).children('input');
				oInput.val(arr[i]);
			}
		}

	};*/
	
	
	if(window.localStorage.getItem("busiregphoto")!=null){
		//alert(1);
		var oimg1pic1 = localStorage.getItem("busiregphoto")
		$("#oImg1").parents('a').css({'background':'url(http://dev.yanfumall.com:7070/netrecv/weuipay/getImage?imageName='+oimg1pic1+') no-repeat','backgroundSize':'cover'});
	}
	if(localStorage.getItem("otherphoto1")!=null){
		var oimg1pic2 = window.localStorage.getItem("otherphoto1")
		$("#oImg2").parents('a').css({'background':'url(http://dev.yanfumall.com:7070/netrecv/weuipay/getImage?imageName='+oimg1pic2+') no-repeat','backgroundSize':'cover'});
	}
	if(localStorage.getItem("certpicpros")!=null){
		console.log(localStorage.getItem("certpicpros"));
		var oimg1pic3 = window.localStorage.getItem("certpicpros")
		$("#oImg3").parents('a').css({'background':'url(http://dev.yanfumall.com:7070/netrecv/weuipay/getImage?imageName='+oimg1pic3+') no-repeat','backgroundSize':'cover'});
	}
	if(localStorage.getItem("certpiccons")!=null){
		var oimg1pic4 = window.localStorage.getItem("certpiccons")
		$("#oImg4").parents('a').css({'background':'url(http://dev.yanfumall.com:7070/netrecv/weuipay/getImage?imageName='+oimg1pic4+') no-repeat','backgroundSize':'cover'});
	}
	if(localStorage.getItem("certper")!=null){
		var oimg1pic5 = window.localStorage.getItem("certper")
		$("#oImg5").parents('a').css({'background':'url(http://dev.yanfumall.com:7070/netrecv/weuipay/getImage?imageName='+oimg1pic5+') no-repeat','backgroundSize':'cover'});
	}
	if(localStorage.getItem("placeoutphoto")!=null){
		var oimg1pic6 = window.localStorage.getItem("placeoutphoto")
		$("#oImg6").parents('a').css({'background':'url(http://dev.yanfumall.com:7070/netrecv/weuipay/getImage?imageName='+oimg1pic6+') no-repeat','backgroundSize':'cover'});
	}
	
	
	//上传图片
	$("#oImg1").change(function(){  
	 	var This = $(this);
   		uploadfile(This,"busiRegPhoto","busiregphoto");
   	}); 
    $("#oImg2").change(function(){  
	 	var This = $(this);
   		uploadfile(This,"otherPhoto1","otherphoto1");
   	}); 
   	$("#oImg3").change(function(){  
	 	var This = $(this);
   		uploadfile(This,"certPicPros","certpicpros");
   	}); 
   	$("#oImg4").change(function(){  
	 	var This = $(this);
   		uploadfile(This,"certPicCons","certpiccons");
   	}); 
   	$("#oImg5").change(function(){  
	 	var This = $(this);
   		uploadfile(This,"certPer","certper");
   	}); 
	$("#oImg6").change(function(){  
	 	var This = $(this);
   		uploadfile(This,"placeOutPhoto","placeoutphoto");
   	}); 
    $cardAcctType.change(function(){  //选择开户行类型
    	console.log($cardAcctType.find("option:selected").text())
    	isSelect();
    });
   
    
    
    $("#sftCreditFee").blur(function(){//贷记卡费率
		if($("#sftCreditFee").val()<0.55){
			$("#sftCreditFee").val('0.55');
		}
	});
	
	$("#SftDepositFee").blur(function(){//借记卡费率
		if($("#SftDepositFee").val()<0.5){
			$("#SftDepositFee").val('0.5');
		}
	});
	
	$("#isHolidaySettlement").blur(function(){//借记卡封顶
		if($("#isHolidaySettlement").val()<20){
			$("#isHolidaySettlement").val('20');
		}
	});
	//mcc码
	var timerMcc = '';
    $mcctext.keyup(function(){
    	$mccCodeList.show();
    	if($mcctext.val()==''){
    		$mccCodeList.hide();
    	}
    	clearTimeout(timerMcc);
    	timerMcc = setTimeout(function(){
    		$.ajax({
    			type:"post",
    			//url:"http://192.168.1.121:7070/smart/mobile/getMccCodeByKey?inputValue="+$mcctext.val()+"",
    			url:"http://dev.yanfumall.com:7070/netrecv/weuipay/getMccCodeByKey?inputValue="+$mcctext.val()+"",
    			async:true,
    			success:function(data){
    				var mccLi = '';
    				for(var i=0;i<data.length;i++){
    					mccLi+='<li mccdata='+data[i].data+' mccval='+data[i].value+'>'+data[i].text+'</li>';
    				}
    				$mccCodeList.html(mccLi);
    			}
    		});
    	},800)
    })
    $mccCodeList.on('click','li',function(){
    	$mccCodeList.hide();
    	$mcctext.val($(this).text());
    	//console.log($(this).attr('mccdata'),$(this).attr('mccval'));
    	
    	$("#mccCode").val($(this).attr('mccdata'));
    	
    });
	$next.click(function() {
		localStorage.setItem("level0Mag",$("#level0Mag").find("option:selected").attr("value") );//0级机构
		localStorage.setItem("level1Mag",$("#level1Mag").find("option:selected").attr("value") );//1级机构
		localStorage.setItem("level2Mag",$("#level2Mag").find("option:selected").attr("value"));//2级机构
		localStorage.setItem("busrId",$("#busrId").val());//登录号
		localStorage.setItem("usrName",$("#usrName").val());//商户全称
		localStorage.setItem("printName",$("#printName").val());//小票打印名称
		localStorage.setItem("mcctext",$("#mcctext").val());//mcc码名称
		localStorage.setItem("mccCode",$("#mccCode").val());//mcc码
		localStorage.setItem("nodeSname",$("#nodeSname").val());//网店简称
		localStorage.setItem("operName",$("#operName").val());//操作员姓名
		localStorage.setItem("operMp",$("#operMp").val());//操作员手机
		localStorage.setItem("posAddr",$("#posAddr").val());//pos安装地址
		localStorage.setItem("staffName",$("#staffName").val());//企业法人姓名
		localStorage.setItem("staffCertId",$("#staffCertId").val());//法人证件号
		localStorage.setItem("cardId",$("#cardId").val());//结算卡号
		localStorage.setItem("posName",$("#posName").val());//pos姓名
		localStorage.setItem("posMp",$("#posMp").val());//pos手机
		localStorage.setItem("sftBusiRegCode",$("#sftBusiRegCode").val());//营业执照号
		localStorage.setItem("cardName",$("#cardName").val());//银行卡户名
		localStorage.setItem("sftBusiValidStartDate",$("#sftBusiValidStartDate").val());//营业执照起始日期
		localStorage.setItem("sftBusiValidEndDate",$("#sftBusiValidEndDate").val());//营业执照结束日期
		localStorage.setItem("usrProv", $("#usrProv").find("option:selected").attr("value"));//营业省
		localStorage.setItem("usrArea", $("#usrArea").find("option:selected").attr("value"));//营业市
		localStorage.setItem("openStat", $("#cardAcctType").find("option:selected").attr("value"));//进件类型
		localStorage.setItem("bankId",$("#bankId").find("option:selected").val());//开户银行
		localStorage.setItem("cardProvId",$cardProvId.find("option:selected").attr('ProvId'));//开户省编码
		localStorage.setItem("cardAreaId",$("#cardAreaId").find("option:selected").attr('areaid'));//开户市编码
		localStorage.setItem("cardAcctType", $("#publicprivate").find("option:selected").attr('areaid'));//对公或对私
		var isNull = true;
		var number = 0;
		$("#posName").val($("#operName").val());
		$("#posMp").val($("#operMp").val());
		if($("#printName").val()==''){
			$("#printName").val($("#usrName").val());
		}
		if($cardAcctType.find("option:selected").text() == '个人'){
    		number = 23;
    	}else if($cardAcctType.find("option:selected").text() == '企业'){
    		number = 28;
    	}
		//console.log(oLabel.length)
		if($("#mccCode").val()==''){
			alert('您输入的mcc码不正确');
		};
		for (var i=0;i<number;i++) {
			var obj = oLabel.eq(i).children();
			var objchild1 = obj.eq(1);//选择第一个子节点 input||select
			var objchild2 = obj.eq(2);//选择第二个子节点 em
			
			objchild2.hide();
			
			if(objchild1.val() == ''){
				console.log(objchild1);
				objchild2.show();
				isNull = false;
			}
		}
		if (isNull) {
			window.location.href = '/netrecv/weuipay/applyPosNext';	
		}
		
		var formVal = $('#oform').serialize();
		localStorage.setItem("formValName", formVal);//表单
		
	});
	$("#submit").click(function(){
		var  formVal = localStorage.getItem("formValName");
		var formVal1 = $("#form1").serialize();
		
		
		var busiregphoto = localStorage.getItem("busiregphoto")||'';
		var otherphoto1 = localStorage.getItem("otherphoto1")||'';
		var certpicpros = localStorage.getItem("certpicpros")||'';
		var certpiccons = localStorage.getItem("certpiccons")||'';
		var certper = localStorage.getItem("certper")||'';
		var placeoutphoto = localStorage.getItem("placeoutphoto")||'';
		
		var picval = 'busiRegPhoto='+busiregphoto+'&otherPhoto1='+otherphoto1+'&certPicPros='+certpicpros+'&certPicCons='+certpiccons+'&certPer='+certper+'&placeOutPhoto='+placeoutphoto+''
		var str = formVal+'&'+formVal1+'&'+picval;
		console.log(str);
		$.ajax({
			type:"post",
			url:"http://dev.yanfumall.com:7070/netrecv/weuipay/applyPosCommit",
			async:true,
			data:str,
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			success:function(data){
				
				//window.location.href = '/netrecv/weuipay/applyPosEnd';	
				if(data.errCode=="200"){
					window.location.href = '/netrecv/weuipay/applyPosEnd';
					localStorage.clear();
				}else{
					alert(data.errMsg);
				}
				console.log(data)
			}
		});
		
	});
	
	$.ajax({//获取风控模板
		type:"post",
		//url:"http://192.168.1.121:7070/smart/mobile/queryRcTempId?termProdType=P&level=0&custId=6000000022",
		url:"http://dev.yanfumall.com:7070/netrecv/weuipay/queryRcTempId?termProdType=P&level=0&custId=6000000022",
		async:true,
		success:function(data){
			var module = '';
			$.each(data, function(key,item) {
				module+="<option moduleId="+key+" value="+item+">"+item+"</option>";
			});
			$("#tempId").html(module);
			$("#tempId").change(function(){
				var temType = $("#tempType").find("option:selected").val();
				var temNum = $("#tempId").find("option:selected").attr("moduleId");
				$("#controlTemplate").show();
				$.ajax({
					type:"post",
					//url:"http://192.168.1.121:7070/smart/mobile/queryRcTemp?termProdType="+temType+"&rcTempId="+temNum+"",
					url:"http://dev.yanfumall.com:7070/netrecv/weuipay/queryRcTemp?termProdType="+temType+"&rcTempId="+temNum+"",
					async:true,
					success:function(data){
						$("#oneLimit").text(data.oneLimit);
						$("#oneFloorLimit").text(data.oneFloorLimit);
						$("#dayLimit").text(data.dayLimit);
						$("#monLimit").text(data.monLimit);
						$("#crDayLimit").text(data.crDayLimit);
						$("#crMonLimit").text(data.crMonLimit);
						$("#crOneLimit").text(data.crOneLimit);
					}
				});
			})
		}
	});
	//营业地址所在区
	var timer = '';
	$sftDistrictName.keyup(function(){
		var adressvalue = $sftDistrictName.val();
		clearTimeout(timer);
		timer = setTimeout(function(){
			$districtList.show();
			if(adressvalue==''){
				$districtList.hide();
			}
			$.ajax({
				type:"post",
				//url:"http://192.168.1.121:7070/smart/mobile/getSftDistrict?name="+adressvalue+"&type=0004",
				url:"http://dev.yanfumall.com:7070/netrecv/weuipay/getSftDistrict?name="+adressvalue+"&type=0004",
				async:true,
				success:function(data){
					var str = '';
					for (var i=0;i<data.length;i++) {
						str+='<li districtId='+data[i].districtId+'>'+data[i].districtName+'</li>';
					}
					$districtList.html(str);
				}
			});
		},800);
	});
	$districtList.on('click','li',function(){//营业地址所在区列表
		$districtList.hide();
		$sftDistrictName.val($(this).text());
		$("#districtCode").val($(this).attr('districtId'));
	});
	//开户行银行
	var timer1 = '';
	$sftBankBranchName.keyup(function(){
		var bankIds = localStorage.getItem("bankId");
		var cardProvIds = localStorage.getItem("cardProvId");
		var cardAreaIds = localStorage.getItem("cardAreaId");
		console.log(bankIds,cardProvIds,cardAreaIds);
		$districtName.show();
		if($sftBankBranchName.val()==''){
			$districtName.hide();
		}
		clearTimeout(timer1);
		timer1=setTimeout(function(){
			$.ajax({
				type:"post",
				//url:"http://192.168.1.121:7070/smart/mobile/getSftBank?name="+$sftBankBranchName.val()+"&code="+bankIds+","+cardProvIds+","+cardAreaIds+"",
				url:"http://dev.yanfumall.com:7070/netrecv/weuipay/getSftBank?name="+$sftBankBranchName.val()+"&code="+bankIds+","+cardProvIds+","+cardAreaIds+"",
				async:true,
				success:function(data){
					var str = '';
					for (var i=0;i<data.length;i++) {
						str+='<li bankid='+data[i].bankId+' value='+data[i].bankName+'>'+data[i].bankName+'</li>';
					}
					$districtName.html(str);
				}
			});
		},800)
	});
	$districtName.on('click','li',function(){
		$districtName.hide();
		$sftBankBranchName.val($(this).text())
		$("#bankBranchCode").val($(this).attr("bankid"));
	});
	//选择已经存储的数据
	function selectoption(obj,item,objArea,areaItem){
	
		if(window.localStorage.getItem(item)!=null){
			var itemvalue = localStorage.getItem(item);
			var options = obj.children();
			//console.log(options);
			for(var i=0;i<options.length;i++){
				if(options.eq(i).attr('value')==itemvalue){
					options.eq(i).attr('selected',true);
				}
			}
			if(window.localStorage.getItem(areaItem)!=null){
				$.ajax({
					type:"post",
					//url:"http://192.168.1.121:7070/smart/mobile/getAreaList?provId="+areaId+"",
					url:"http://dev.yanfumall.com:7070/netrecv/weuipay/getAreaList?provId="+itemvalue+"",
					async:true,
					success:function(areaList){
						var str1='';
						$.each(areaList, function(item,key) {
							str1+="<option areaid="+item+" value="+item+" >"+key+"</option>";
						});
						objArea.html(str1);
						var areavalue = localStorage.getItem(areaItem);
						var areaoptions = objArea.children();
						//console.log(options);
						for(var i=0;i<areaoptions.length;i++){
							if(areaoptions.eq(i).attr('value')==areavalue){
								areaoptions.eq(i).attr('selected',true);
							}
						}
					}
				});
			}
		}
	}
	function uploadfile(This,mark,picname){  //上传照片
    	var file = This.prop('files')[0];  
        if (window.FileReader) {  
            var reader = new FileReader();  
            reader.readAsDataURL(file);  
            //监听文件读取结束后事件  
            reader.onloadend = function (e) {
//          	    	
				var formData = new FormData();
				formData.append('file',file);
				$.ajax({ 
					//url :"http://192.168.1.121:7070/smart/mobile/upload.do?custId="+custId+"&mark="+mark+"" , 
					url :"http://dev.yanfumall.com:7070/netrecv/weuipay/upload.do?custId="+custId+"&mark="+mark+"" , 
					type : 'POST', 
					data : formData,
					// 告诉jQuery不要去处理发送的数据
					processData : false, 
					// 告诉jQuery不要去设置Content-Type请求头
					contentType : false,
					success : function(data) {
            			localStorage.setItem(picname, data);//存储pic数据
            			
            			This.parents('a').css("background","url(http://dev.yanfumall.com:7070/netrecv/weuipay/getImage?imageName="+data+") no-repeat");
            			This.parents('a').css("backgroundSize","cover");
					}, 
					error : function(responseStr) { 
						console.log("error");
					} 
				});
            };  
        }  
   };
    function isSelect(){ //判断选中的事对公还是对私
    	if($cardAcctType.find("option:selected").text() == '个人'){
    		$certificateInfo.hide();
    		$certificateInfo.find('input').val('');
    		$("#publicprivate").find("option[value='P']").attr('selected',true);
    		$("#publicprivate").find("option[value='p']").siblings().attr('selected',false);
    	}else if($cardAcctType.find("option:selected").text() == '企业'){
    		$certificateInfo.show();
    		selectoption($("#publicprivate"),"cardAcctType",$("#publicprivate"),"");//获取银行开账户类型
    	}
    };
	
	$(".back").click(function(){ //点击返回上一页
		window.history.back();
	});
	
	
});


