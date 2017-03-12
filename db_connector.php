<?php
    mysql_connect("localhost", "root", "rootaemysql") or die("ไม่สามารถเชื่อมต่อฐานข้อมูลได้");
    mysql_select_db("income_cordova") or die(mysql_error());
    mysql_query("SET NAMES utf8");

    header('Access-Control-Allow-Origin: *');

    function sql($sql, $asArray = true) {
        logs("\t" . $sql);

        $result = mysql_query($sql) or die($sql . "\n" . mysql_error());

        if ($result != undefined) {
            $rows = array();
            while ($r = mysql_fetch_assoc($result)) {
                // $rows[] = array_merge(array("i" => $number++), $r);
                $rows[] = $r;
            }

            if (count($rows) == 1 && !$asArray) {
                logs("\t\t\t". json_encode($rows[0]));
                return $rows[0];
            }

            logs("\t\t\t". json_encode($rows));
            return $rows;
        }
    }

    function logs($str) {
        $fileName = "logs.txt";
        if (!file_exists($fileName)) {
            echo "Cannot find file.";
        } else {
            $fileHandle = fopen($fileName, "a") or die("Unable to open");
            fwrite($fileHandle, "\n" . $str);
            fclose($fileHandle);
        }
    }

    $function = $_POST["function"];

    if (isset($function)) {
        logs(date("Y-m-d h:i:s") . "\t\t" . json_encode($_POST) . "\n");

        /******************** #user ********************/
        if ($function == "check_user") {
            $username = $_POST["username"];

            echo json_encode(sql("SELECT COUNT(*) count FROM user WHERE username = '$username'", false));
        }
        else if ($function == "add_user") {
            $name = $_POST["name"];
            $lastname = $_POST["lastname"];
            $username = $_POST["username"];
            $password = $_POST["password"];
            $email = $_POST["email"];
            $level = $_POST["level"];
            $group = $_POST["group"];
            $phone = $_POST["phone"];
            $birthday = $_POST["birthday"];

            if ($level == 0) {
                sql("INSERT INTO user (username, password, name, lastname, email, level, phone, birthday, register_date)
                VALUES ('$username', '$password', '$name', '$lastname', '$email', $level, '$phone', '$birthday', NOW())");
            }
            else {
                $code = "gl" . (intval(sql("SELECT id FROM `group` ORDER BY id DESC LIMIT 1", false)[id]) + 1);
                sql("INSERT INTO `group` (title, code) VALUES ('$group', '$code')");

                $group_id = sql("SELECT id FROM `group` WHERE code = '$code'", false)[id];

                sql("INSERT INTO user (username, password, name, lastname, email, level, phone, birthday, register_date, group_id)
                VALUES ('$username', '$password', '$name', '$lastname', '$email', $level, '$phone', '$birthday', NOW(), $group_id)");
            }

            echo json_encode(sql("SELECT id, group_id FROM user WHERE username = '$username' AND password = '$password'", false));
        }
        else if ($function == "login") {
            $username = $_POST["username"];
            $password = $_POST["password"];

            echo json_encode(sql("SELECT id, level, group_id FROM user WHERE (username = '$username' OR email = '$username') AND password = '$password'", false));
        }
        else if ($function == "get_members_by_group_id") {
            $group_id = $_POST["group_id"];

            echo json_encode(sql("SELECT id, CONCAT(name, ' ', lastname) name, email, phone, group_id FROM user WHERE group_id = $group_id UNION
            SELECT id, CONCAT(name, ' ', lastname) name, email, phone, group_id FROM user WHERE group_id = (-1 * $group_id)"));
        }
        else if ($function == "get_group_detail_by_head_user_id") {
            $user_id = $_POST["user_id"];

            echo json_encode(sql("SELECT g.title, g.code, (SELECT COUNT(*) FROM user WHERE group_id = -1 * g.id) pending FROM `group` g, user u WHERE g.id = u.group_id AND u.id = $user_id", false));
        }
        else if ($function == "approve_member") {
            $user_id = $_POST["user_id"];

            sql("UPDATE user SET group_id = (-1 * group_id) WHERE id = $user_id");
            sql("UPDATE transaction SET group_id = (SELECT group_id FROM user WHERE id = $user_id) WHERE user_id = $user_id");
            echo json_encode(sql("SELECT COUNT(*) ok FROM user WHERE id = $user_id AND group_id > 0"));
        }
        else if ($function == "get_summary_by_user_id") {
            $user_id = $_POST["user_id"];

            $cycle_date = sql("SELECT cycle_date FROM user WHERE id = $user_id", false)[cycle_date];

            $d = new DateTime();
            $before_setdate_month = $d->format('m');
            $d->setDate($d->format('Y'), $d->format('m'), $cycle_date);
            $after_setdate_month = $d->format('m');
            $d->setTime(0, 0, 0);

            if ($before_setdate_month != $after_setdate_month) {
                $d->setDate($d->format('Y'), $d->format('m'), 1);
            }

            $now = new DateTime();
            if ($now < $d) {
                $d->sub(new DateInterval("P1M"));
            }

            $from = $d->format('Y-m-d H:i:s');
            $to = $now->format('Y-m-d H:i:s');

            $txt_from = $d->format('Y-m-d');
            $txt_to = $now->format('Y-m-d');

            echo json_encode(sql("SELECT '$txt_from' date_from, '$txt_to' date_to, SUM(if(type = 0, t.amount, 0)) income, SUM(if(type = 1, t.amount, 0)) outcome,
                    (SELECT SUM(if(type = 0, t.amount, -1 * t.amount)) FROM transaction t WHERE t.user_id = $user_id) amount
                FROM transaction t
                WHERE '$from' <= DATE(t.date) AND DATE(t.date) <= '$to' AND t.user_id = $user_id", false));


        }
        else if ($function == "get_user") {
            $user_id = $_POST["user_id"];

            echo json_encode(sql("SELECT name, lastname, username, email, phone, birthday FROM user WHERE id = $user_id", false));
        }
        else if ($function == "edit_user") {
            $user_id = $_POST["user_id"];
            $name = $_POST["name"];
            $lastname = $_POST["lastname"];
            $username = $_POST["username"];
            $password = $_POST["password"];
            $email = $_POST["email"];
            $phone = $_POST["phone"];
            $birthday = $_POST["birthday"];
            $password_new = $_POST["password_new"];

            $valid = sql("SELECT COUNT(*) count FROM user WHERE id = $user_id AND password = '$password'", false)[count] == 1;
            if ($valid) {
                sql("UPDATE user SET name = '$name', lastname = '$lastname', username = '$username', email = '$email', phone = '$phone', birthday = '$birthday' WHERE id = $user_id");
                if ($password_new != "") {
                    sql("UPDATE user SET password = '$password_new' WHERE id = $user_id");
                }
                echo json_encode("ok");
            }
            else {
                echo json_encode(false);
            }

        }
        /******************** #transaction ********************/
        else if ($function == "get_transaction_titles") {
            $user_id = $_POST["user_id"];
            $type = $_POST["type"];

            echo json_encode(sql("SELECT DISTINCT(title) FROM transaction WHERE user_id = $user_id AND type = $type"));
        }
        else if ($function == "add_transaction") {
            $user_id = $_POST["user_id"];
            $type = $_POST["type"];
            $title = $_POST["title"];
            $amount = $_POST["amount"];
            $date = $_POST["date"];
            $group_id = $_POST["group_id"];

            sql("INSERT INTO transaction (user_id, type, title, amount, date, group_id)
            VALUES ($user_id, $type, '$title', $amount, '$date', $group_id)");

            echo json_encode(sql("SELECT id FROM transaction WHERE user_id = $user_id AND type = $type AND title = '$title' AND amount = $amount AND date = '$date'", false));
        }
        else if ($function == "edit_transaction") {
            $id = $_POST["id"];
            $type = $_POST["type"];
            $title = $_POST["title"];
            $amount = $_POST["amount"];
            $date = $_POST["date"];

            sql("UPDATE transaction SET type = $type, title = '$title', amount = $amount, date = '$date' WHERE id = $id");
            echo json_encode("ok");
        }
        else if ($function == "remove_transaction") {
            $id = $_POST["id"];

            sql("DELETE FROM transaction WHERE id = $id");
            echo json_encode("ok");
        }
        // user
        //// date
        else if ($function == "get_transactions_by_user_id") {
            $user_id = $_POST["user_id"];
            $date_from = $_POST["date_from"];
            $date_to = $_POST["date_to"];

            echo json_encode(sql("SELECT t.id, t.type, t.title, t.amount, t.date FROM transaction t, user u
                WHERE t.user_id = u.id AND '$date_from' <= DATE(t.date) AND DATE(t.date) <= '$date_to' AND u.id = $user_id
                ORDER BY DATE(t.date)"));
        }
        else if ($function == "get_transactions_group_by_date_by_user_id") {
            $user_id = $_POST["user_id"];
            $date_from = $_POST["date_from"];
            $date_to = $_POST["date_to"];

            echo json_encode(sql("SELECT DATE(t.date) date, SUM(if(type = 0, t.amount, 0)) income, SUM(if(type = 0, 1, 0)) count_income, SUM(if(type = 1, t.amount, 0)) outcome, SUM(if(type = 1, 1, 0)) count_outcome
                FROM transaction t
                WHERE '$date_from' <= DATE(t.date) AND DATE(t.date) <= '$date_to' AND t.user_id = $user_id
                GROUP BY DATE(t.date)"));
        }
        else if ($function == "get_transactions_group_by_title_by_user_id") {
            $user_id = $_POST["user_id"];
            $date_from = $_POST["date_from"];
            $date_to = $_POST["date_to"];

            echo json_encode(sql("SELECT t.type, t.title, SUM(t.amount) amount, COUNT(*) count FROM transaction t
                WHERE '$date_from' <= DATE(t.date) AND DATE(t.date) <= '$date_to' AND t.user_id = $user_id
                GROUP BY type, title ORDER BY amount DESC"));
        }
        //// month
        else if ($function == "get_transactions_group_by_month_by_user_id") {
            $user_id = $_POST["user_id"];
            $month_from = $_POST["month_from"];
            $month_to = $_POST["month_to"];

            echo json_encode(sql("SELECT DATE(t.date) date, SUM(if(type = 0, t.amount, 0)) income, SUM(if(type = 0, 1, 0)) count_income, SUM(if(type = 1, t.amount, 0)) outcome, SUM(if(type = 1, 1, 0)) count_outcome
                FROM transaction t
                WHERE '$month_from' <= DATE(t.date) AND DATE(t.date) <= '$month_to' AND t.user_id = $user_id
                GROUP BY YEAR(t.date), MONTH(t.date)"));
        }
        else if ($function == "get_transactions_group_by_month_by_title_by_user_id") {
            $user_id = $_POST["user_id"];
            $month_from = $_POST["month_from"];
            $month_to = $_POST["month_to"];

            echo json_encode(sql("SELECT t.type, t.title, SUM(t.amount) amount, COUNT(*) count FROM transaction t
                WHERE '$month_from' <= DATE(t.date) AND DATE(t.date) <= '$month_to' AND t.user_id = $user_id
                GROUP BY type, title, YEAR(t.date), MONTH(t.date) ORDER BY amount DESC"));
        }

        // group
        //// date
        else if ($function == "get_transactions_by_group_id") {
            $date_from = $_POST["date_from"];
            $date_to = $_POST["date_to"];
            $group_id = $_POST["group_id"];

            echo json_encode(sql("SELECT t.type, t.title, t.amount, t.date, CONCAT(u.name, ' ', u.lastname) name FROM transaction t, user u
                WHERE t.user_id = u.id AND '$date_from' <= DATE(t.date) AND DATE(t.date) <= '$date_to' AND u.group_id = $group_id
                ORDER BY DATE(t.date)"));
        }
        else if ($function == "get_transactions_group_by_date_by_group_id") {
            $group_id = $_POST["group_id"];
            $date_from = $_POST["date_from"];
            $date_to = $_POST["date_to"];

            echo json_encode(sql("SELECT DATE(t.date) date, SUM(if(type = 0, t.amount, 0)) income, SUM(if(type = 0, 1, 0)) count_income, SUM(if(type = 1, t.amount, 0)) outcome, SUM(if(type = 1, 1, 0)) count_outcome
                FROM transaction t
                WHERE '$date_from' <= DATE(t.date) AND DATE(t.date) <= '$date_to' AND t.group_id = $group_id
                GROUP BY DATE(t.date)"));
        }
        else if ($function == "get_transactions_group_by_title_by_group_id") {
            $group_id = $_POST["group_id"];
            $date_from = $_POST["date_from"];
            $date_to = $_POST["date_to"];

            echo json_encode(sql("SELECT t.type, t.title, SUM(t.amount) amount, COUNT(*) count FROM transaction t
                WHERE '$date_from' <= DATE(t.date) AND DATE(t.date) <= '$date_to' AND t.group_id = $group_id
                GROUP BY type, title ORDER BY amount DESC"));
        }
        //// month
        else if ($function == "get_transactions_group_by_month_by_group_id") {
            $group_id = $_POST["group_id"];
            $month_from = $_POST["month_from"];
            $month_to = $_POST["month_to"];

            echo json_encode(sql("SELECT DATE(t.date) date, SUM(if(type = 0, t.amount, 0)) income, SUM(if(type = 0, 1, 0)) count_income, SUM(if(type = 1, t.amount, 0)) outcome, SUM(if(type = 1, 1, 0)) count_outcome
                FROM transaction t
                WHERE '$month_from' <= DATE(t.date) AND DATE(t.date) <= '$month_to' AND t.group_id = $group_id
                GROUP BY YEAR(t.date), MONTH(t.date)"));
        }
        else if ($function == "get_transactions_group_by_month_by_title_by_group_id") {
            $group_id = $_POST["group_id"];
            $month_from = $_POST["month_from"];
            $month_to = $_POST["month_to"];

            echo json_encode(sql("SELECT t.type, t.title, SUM(t.amount) amount, COUNT(*) count FROM transaction t
                WHERE '$month_from' <= DATE(t.date) AND DATE(t.date) <= '$month_to' AND t.group_id = $group_id
                GROUP BY type, title, YEAR(t.date), MONTH(t.date) ORDER BY amount DESC"));
        }

        /******************** #group ********************/
        else if ($function == "get_group") {
            $group_id = $_POST["group_id"];

            echo json_encode(sql("SELECT id, title, code FROM `group` WHERE id = $group_id", false));
        }
        else if ($function == "get_groups") {

            echo json_encode(sql("SELECT id, title, code FROM `group`"));
        }
        else if ($function == "join_group") {
            $user_id = $_POST["user_id"];
            $group_id = $_POST["group_id"];

            sql("UPDATE user SET group_id = $group_id WHERE id = $user_id");
            echo json_encode(sql("SELECT COUNT(*) ok FROM user WHERE id = $user_id AND group_id = $group_id", false));
        }

        /******************** #schedule ********************/
        else if ($function == "get_schedules") {
            $user_id = $_POST["user_id"];

            echo json_encode(SQL("SELECT id, user_id, type, title, frequency, state FROM schedule WHERE user_id = $user_id"));
        }
        else if ($function == "get_schedule") {
            $id = $_POST["id"];

            echo json_encode(SQL("SELECT id, user_id, type, title, frequency, state FROM schedule WHERE id = $id", false));
        }
        else if ($function == "add_schedule") {
            $user_id = $_POST["user_id"];
            $type = $_POST["type"];
            $title = $_POST["title"];
            $frequency = $_POST["frequency"];

            SQL("INSERT INTO schedule (user_id, type, title, frequency, state) VALUES ($user_id, $type, '$title', '$frequency', 1)");
            echo json_encode("ok");
        }
        else if ($function == "edit_schedule") {
            $id = $_POST["id"];
            $type = $_POST["type"];
            $title = $_POST["title"];
            $frequency = $_POST["frequency"];

            SQL("UPDATE schedule SET type = $type, title = '$title', frequency = '$frequency' WHERE id = $id");
            echo json_encode("ok");
        }
        else if ($function == "swap_schedule") {
            $id = $_POST["id"];

            SQL("UPDATE schedule SET state = !state WHERE id = $id");
            echo json_encode("ok");
        }
        else if ($function == "remove_schedule") {
            $id = $_POST["id"];

            SQL("DELETE FROM schedule WHERE id = $id");
            echo json_encode("ok");
        }
    }
?>
