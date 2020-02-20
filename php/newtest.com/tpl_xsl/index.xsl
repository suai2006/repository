<?xml version="1.0" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<!--Объявление шаблонов-->
	<xsl:import href="head.xsl" />
	<xsl:import href="header.xsl" />
	<xsl:import href="footer.xsl" />
	<xsl:import href="leftsidebar.xsl" />
	<xsl:import href="content.xsl" />
	<xsl:output method="html" doctype-system="about:legacy-compat" />
<xsl:template match="/">
<html>
	<head>
		<title>
			<xsl:value-of select="pageinfo/page/@pagetitle"/> | Шаблон XSLT
		</title>
		<xsl:call-template name="head" />
	</head>
	<body>
		<!-- <div class="setka"></div> -->
		<div class="main">
			<xsl:call-template name="header" />
			<xsl:call-template name="leftsidebar" />
			<xsl:call-template name="content" />
			<div class="pre-footer"></div>
		</div>
		<xsl:call-template name="footer" />
	</body>
</html>
</xsl:template>
</xsl:stylesheet>