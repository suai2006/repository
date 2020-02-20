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
		<ul>
		<xsl:for-each select="root/link">
			<li>
				<a href="/{@href}">
					<xsl:value-of select="@text"/>
				</a>
			</li>
		</xsl:for-each>
		</ul>
		<h1><xsl:value-of select="//@pagetitle"/></h1>
		<script src="/js/admin/common.js" />
	</body>
</html>
</xsl:template>
</xsl:stylesheet>