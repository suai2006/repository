<?php
class tempelate
{
	public $db;
	public $doc;
	public $root;
	public $id;
	public $parent;
	public $child;
	public $value;
	public $table;
	public $where;
	public $arr;
	public $rootTag;

	// Преобразование XML спомощью XSLT стилей
	public function xmlDoc($tpl)
	{
		$this->doc = new DOMDocument();
		$this->doc->formatOutput = true;
		$xsldoc = new DOMDocument();
		$xsldoc->load(realpath(dirname(__FILE__).'/../../tpl_xsl/'.$tpl));
		$this->root = $this->doc->createElement($this->rootTag);
		$this->doc->appendChild($this->root);
		$this->buildXML($this->parent,$this->child);
		$xsl = new XSLTProcessor();
		$this->doc->saveXML();
		$xsl->importStyleSheet($xsldoc);
		return $xsl->transformToXML($this->doc);
//		Header("Content-type: application/xml; charset=utf-8");
//		echo $this->doc->saveXML();
	}
	private function sql($value,$where,$table){
		$sql=$this->db->query("SELECT ".$this->value[$value]." FROM ".$this->table[$table]."
								WHERE ".$this->where[$where]) or die("Error in the consult.." . mysqli_error($this->db));
	mysqli_query ("SET NAMES utf-8");
		return $sql;
	}
	// Метод для полученя меню
	public function selectToXML($parent,$child)
	{
		$sql=$this->sql('menu', 0, 0);
		$this->cycleToXML($sql,$parent,$child);
	}
	// Метод для полученя контента
	public function getContentXml() {
		$rs1=$this->sql('content', 1, 0);
		if($rs1->num_rows!=0)
		{
			$this->cycleToXML($rs1,'','page');
		}
		else
		{
			header('HTTP/1.0 404 Not Found');
			include_once realpath(dirname(__FILE__).'/../../error/error404.html');
			die();
		}
	}
	// Пробегаемся по массиву и формируем файл
	public function cycleToXML($sql,$parent,$child){
		if($parent!=''){
			$userlist= $this->doc->createElement($parent);
			$this->root->appendChild($userlist);
		}
		while($rows=$sql->fetch_array(MYSQLI_ASSOC))
			{
				$page = $this->doc->createElement($child);
				if($parent!=''){
					$userlist->appendChild($page);
				}else
				{
					$this->root->appendChild($page);
				}
				foreach ($rows as $key => $value)
				{
					$attr = $this->doc->createAttribute($key);
					$attr->value =$value;
					$page->appendChild($attr);
				}
			}
	}
	// Посторение файлу
	public function buildXML($parent,$child){
		$this->selectToXML($parent,$child);
		$this->getContentXml();
	}

}
