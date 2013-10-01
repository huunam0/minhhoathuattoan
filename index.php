<?php
$link = mysql_connect("localhost", "root", "");
mysql_select_db("trochoimatran");
mysql_query("SET NAMES utf8"); //connect in decode utf8

echo "<html><head><title>Tro choi ma tran</title></head><body>";
//ini_set('session.gc-maxlifetime', 60*30);
session_start();
if (isset($_SESSION['ten'])) { //da dang nhap
	if (isset($_POST['vong'])) {
		$sql="insert into ketqua (hoten,lop,vong,ngaygio) value ('".$_SESSION['ten']."','".$_SESSION['lop']."',".$_POST['vong'].",NOW())";
		$ret=mysql_query($sql) or die(mysql_error());
	} else {
		redirect("apps/code/vi.html",1);
	}
} else {
	if (isset($_POST['dangnhap'])) {
		if (!isset($_POST['ten'])) {
			echo "Vui long ghi ho ten.";
		}
		if (strlen($_POST['ten'])<4) {
			echo "Ten qua ngan.";
		}
		else {
			$_SESSION['ten']=$_POST['ten'];
			$_SESSION['lop']=$_POST['lop'];
			echo "Dang nhap thanh cong";
		}
		redirect("apps/code/vi.html",1);
	}
	else {
		echo "<center>";
		echo "<form action='?' method='post'>";
		echo "Ho va ten: <input type='text' name='ten' size='50'><br/><br/>";
		echo "Lop: <input type='text' name='lop' size='30'><br/><br/>";
		echo "<input type='submit' name='dangnhap' value='Dang nhap'><br/>";
		echo "</form>";
	}
}
echo "</body></html>";
function redirect($location, $delaytime = 0) {
    if ($delaytime>0) {    
        header( "refresh: $delaytime; url='".str_replace("&amp;", "&", $location)."'" );
    } else {
        header("Location: ".str_replace("&amp;", "&", $location));
    }    
}
?>
