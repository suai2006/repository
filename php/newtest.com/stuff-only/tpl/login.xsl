<?xml version="1.0" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<!--Объявление шаблонов-->
	<xsl:import href="head.xsl" />
	<xsl:output method="html" doctype-system="about:legacy-compat" />
<xsl:template match="/">
<html>
	<head>
		<title><xsl:value-of select="root/page/@title"/></title>
		<xsl:call-template name="head" />
	</head>
	<body>
		<!--div class="setka"></div-->
		<div class="admin">
			<form class="admin__form" method="post" action="backend/login.php" onsubmit="return admin.login();">
				<h2 class="admin__form-title">Авторизуйтесь</h2>
				<div>
					<input id="login" class="form-input" type="text" name="login" value="" placeholder="Логин" />
					<div id="login_err" class="error_mess"></div>
					<input id="password" class="form-input" type="password" name="password" value="" placeholder="Пароль" />
					<div id="password_err" class="error_mess"></div>
				</div>
				<input class="form-input__btn" type="submit" name="submit" value="вход" />
				<div>
					<input id="check1" type="checkbox" name="option" value="1" placeholder="Пароль" />
					<lable for="check1">Запомнить меня</lable>
				</div>
			</form>
			<div class="pre-footer"></div>
		</div>
		<script src="/js/admin/common.js" />
	</body>
</html>
</xsl:template>
</xsl:stylesheet>