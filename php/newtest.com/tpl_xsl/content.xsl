<?xml version="1.0" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:variable name="nodes" select="//node() | //namespace::* | //comment() | //processing-instruction()" />
	<xsl:template name="content" >
	<div class="main__content">
		<h1>
			<xsl:value-of select="pageinfo/page/@pagetitle"/>
		</h1>
		<div>
			<xsl:value-of select="pageinfo/page/@content"/>
		</div>
	</div>
	<ul>
	<!-- Произвольный цикл от 1 до 5 -->
	<xsl:for-each select="(//node())[5 >= position()]">
		<li><xsl:value-of select="position()"/></li>
	</xsl:for-each>
	</ul>
	</xsl:template>
</xsl:stylesheet>