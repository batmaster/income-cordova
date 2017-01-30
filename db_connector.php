<?php
    mysql_connect("localhost","root","rootaemysql") or die("ไม่สามารถเชื่อมต่อฐานข้อมูลได้");
    mysql_select_db("income_cordova") or die(mysql_error());
    mysql_query("SET NAMES utf8");

    function sql($sql) {
        $result = mysql_query($sql) or die($sql . "\n" . mysql_error());

        if ($result != undefined) {
            $rows = array();
            while ($r = mysql_fetch_assoc($result)) {
                // $rows[] = array_merge(array("i" => $number++), $r);
                $rows[] = $r;
            }

            if (count($rows) == 1) {
                return $rows[0];
            }

            return $rows;
        }
    }

    $function = $_POST["function"];

    if (isset($function)) {
        if ($function == "check_user") {
            $username = $_POST["username"];

            echo json_encode(sql("SELECT COUNT(*) count FROM user WHERE username = '$username'"));
        }
        else if ($function == "add_user") {
            $name = $_POST["name"];
            $lastname = $_POST["lastname"];
            $username = $_POST["username"];
            $password = $_POST["password"];
            $email = $_POST["email"];
            $level = $_POST["level"];
            $phone = $_POST["phone"];
            $birthday = $_POST["birthday"];

            sql("INSERT INTO user (username, password, name, lastname, email, level, phone, birthday, register_date)
            VALUES ('$username', '$password', '$name', '$lastname', '$email', $level, '$phone', '$birthday', NOW())");

            echo json_encode(sql("SELECT id FROM user WHERE username = '$username' AND password = '$password'"));
        }
        else if ($function == "login") {
            $username = $_POST["username"];
            $password = $_POST["password"];

            echo json_encode(sql("SELECT id FROM user WHERE username = '$username' AND password = '$password'"));
        }

    }
?>
