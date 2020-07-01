module LastModifiedFilter
  def last_modified( input )
    dirname = File.dirname(File.dirname(__dir__)) + '/docs'
    path = dirname + input
    modification_time = File.mtime( path ).to_i

    "#{input}?v=#{modification_time}"
  end
end

Liquid::Template.register_filter(LastModifiedFilter)
