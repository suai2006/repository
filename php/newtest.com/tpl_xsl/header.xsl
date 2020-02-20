<?xml version="1.0" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:import href="menu/menu-link.xsl" />
<xsl:import href="menu/menu.xsl" />
<xsl:template name="header" >
<div class="header">
	Шапка сайта
	<xsl:call-template name="menu" />
</div>
</xsl:template>
</xsl:stylesheet>